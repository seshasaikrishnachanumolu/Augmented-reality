/**
 * Standalone WebSocket signaling server for AR account-to-account calls.
 *
 * Next.js's normal request/response model (and most of its hosting targets)
 * can't hold a persistent WebSocket connection open, so call signaling —
 * presence, "ring this account id", accept/decline, and relaying WebRTC
 * SDP/ICE messages — runs in this separate long-lived Node process instead.
 * Once a call is accepted, actual audio/video never touches this server: it
 * flows directly peer-to-peer over WebRTC between the two browsers.
 *
 * Run with `npm run signaling` (tsx) alongside `npm run dev`. In production
 * this needs to run as its own always-on process (e.g. a small Node
 * service), since it cannot live inside a serverless Next.js deployment.
 */
import { randomUUID } from "node:crypto";
import { WebSocket, WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";
import type {
  ClientToServerMessage,
  ServerToClientMessage,
} from "../types/call";

// Separate PrismaClient instance from the Next.js process's singleton —
// this server runs in its own Node process, so it needs its own client.
// Writes here are best-effort call history only; they never gate the live
// call flow, so failures are swallowed rather than blocking signaling.
const prisma = new PrismaClient();

const PORT = Number(process.env.SIGNALING_PORT ?? 4001);

interface ConnectedClient {
  socket: WebSocket;
  accountId: string;
  name: string;
}

interface ActiveCall {
  id: string;
  callerAccountId: string;
  calleeAccountId: string;
  status: "ringing" | "connected";
}

async function recordCallInvite(callId: string, callerId: string, callee: string): Promise<void> {
  try {
    await prisma.callInvite.create({ data: { id: callId, callerId, callee, status: "ringing" } });
  } catch {
    // Best-effort history only — e.g. if the account id doesn't correspond
    // to a real User row (shouldn't normally happen since callers/callees
    // are only ever registered account ids), just skip recording it.
  }
}

async function updateCallInviteStatus(
  callId: string,
  status: "accepted" | "declined" | "ended" | "missed"
): Promise<void> {
  try {
    await prisma.callInvite.update({
      where: { id: callId },
      data: { status, endedAt: status === "ended" ? new Date() : undefined },
    });
  } catch (err) {
    // Row may not exist if recordCallInvite failed earlier — non-fatal.
    console.error(`[signaling] failed to update call ${callId} to ${status}:`, err);
  }
}

// accountId -> connected client. An account id can only have one active
// socket at a time; registering again (e.g. page reload) replaces it.
const clients = new Map<string, ConnectedClient>();
// callId -> call. Tracks in-flight invites and accepted calls so hang-up /
// signal relay messages know which two accounts to route between.
const calls = new Map<string, ActiveCall>();

function send(client: ConnectedClient | undefined, message: ServerToClientMessage): void {
  if (!client || client.socket.readyState !== WebSocket.OPEN) return;
  client.socket.send(JSON.stringify(message));
}

function broadcastPresence(): void {
  const onlineAccountIds = Array.from(clients.keys());
  const message: ServerToClientMessage = { type: "presence", onlineAccountIds };
  for (const client of clients.values()) {
    send(client, message);
  }
}

function findCallForParticipant(callId: string, accountId: string): ActiveCall | undefined {
  const call = calls.get(callId);
  if (!call) return undefined;
  if (call.callerAccountId !== accountId && call.calleeAccountId !== accountId) return undefined;
  return call;
}

function otherParty(call: ActiveCall, accountId: string): string {
  return call.callerAccountId === accountId ? call.calleeAccountId : call.callerAccountId;
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket: WebSocket) => {
  let registeredAccountId: string | null = null;

  socket.on("message", (raw: Buffer) => {
    let message: ClientToServerMessage;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (message.type) {
      case "register": {
        // Replace any existing connection for this account id (e.g. a stale
        // tab) rather than stacking up dead sockets.
        const existing = clients.get(message.accountId);
        if (existing && existing.socket !== socket) {
          existing.socket.close();
        }
        registeredAccountId = message.accountId;
        clients.set(message.accountId, { socket, accountId: message.accountId, name: message.name });
        broadcastPresence();
        break;
      }

      case "call-invite": {
        if (!registeredAccountId) return;
        const callee = clients.get(message.toAccountId);
        const caller = clients.get(registeredAccountId);
        if (!callee || !caller) {
          send(caller, {
            type: "call-error",
            message: "That account id isn't online right now.",
          });
          return;
        }
        if (message.toAccountId === registeredAccountId) {
          send(caller, { type: "call-error", message: "You can't call yourself." });
          return;
        }

        const callId = randomUUID();
        calls.set(callId, {
          id: callId,
          callerAccountId: registeredAccountId,
          calleeAccountId: message.toAccountId,
          status: "ringing",
        });
        void recordCallInvite(callId, registeredAccountId, message.toAccountId);

        send(callee, {
          type: "incoming-call",
          fromAccountId: caller.accountId,
          fromName: caller.name,
          callId,
        });
        break;
      }

      case "call-response": {
        if (!registeredAccountId) return;
        const call = findCallForParticipant(message.callId, registeredAccountId);
        if (!call) return;

        if (message.accepted) {
          call.status = "connected";
          void updateCallInviteStatus(call.id, "accepted");
        } else {
          calls.delete(message.callId);
          void updateCallInviteStatus(call.id, "declined");
        }

        const caller = clients.get(call.callerAccountId);
        send(caller, { type: "call-result", callId: call.id, accepted: message.accepted });
        break;
      }

      case "signal-description":
      case "signal-candidate":
      case "hang-up": {
        if (!registeredAccountId) return;
        const call = findCallForParticipant(message.callId, registeredAccountId);
        if (!call) return;

        const targetAccountId = otherParty(call, registeredAccountId);
        const target = clients.get(targetAccountId);
        send(target, message);

        if (message.type === "hang-up") {
          calls.delete(message.callId);
          void updateCallInviteStatus(message.callId, "ended");
        }
        break;
      }
    }
  });

  socket.on("close", () => {
    if (!registeredAccountId) return;
    const current = clients.get(registeredAccountId);
    // Only remove if this socket is still the registered one for that
    // account (guards against a reconnect race where the old socket's
    // close event fires after a new one has already replaced it).
    if (current?.socket === socket) {
      clients.delete(registeredAccountId);
      broadcastPresence();

      // End any calls this account was part of so the other side isn't
      // left hanging silently.
      for (const [callId, call] of calls) {
        if (call.callerAccountId === registeredAccountId || call.calleeAccountId === registeredAccountId) {
          const other = clients.get(otherParty(call, registeredAccountId));
          send(other, { type: "hang-up", callId });
          void updateCallInviteStatus(callId, call.status === "ringing" ? "missed" : "ended");
          calls.delete(callId);
        }
      }
    }
  });
});

wss.on("listening", () => {
  console.log(`[signaling] WebSocket server listening on ws://localhost:${PORT}`);
});
