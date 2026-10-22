/**
 * Shared message contract between the browser client and the standalone
 * WebSocket signaling server (server/signaling-server.ts). The signaling
 * server's only job is presence (who's online by account id) and relaying
 * call-setup messages between two specific account ids — it never touches
 * the actual audio/video, which flows peer-to-peer over WebRTC once a call
 * is accepted.
 */

/** Sent by the client right after the socket opens, to announce who it is. */
export interface RegisterMessage {
  type: "register";
  accountId: string;
  name: string;
}

/** Caller -> server -> callee: "please ring this account id". */
export interface CallInviteMessage {
  type: "call-invite";
  toAccountId: string;
}

/** Server -> callee: someone is calling them. */
export interface IncomingCallMessage {
  type: "incoming-call";
  fromAccountId: string;
  fromName: string;
  callId: string;
}

/** Callee -> server -> caller: accepted or declined. */
export interface CallResponseMessage {
  type: "call-response";
  callId: string;
  accepted: boolean;
}

/** Server -> caller: tells them the outcome of their invite. */
export interface CallResultMessage {
  type: "call-result";
  callId: string;
  accepted: boolean;
}

/** Either side -> server -> other side: WebRTC SDP offer/answer relay. */
export interface SignalDescriptionMessage {
  type: "signal-description";
  callId: string;
  description: RTCSessionDescriptionInit;
}

/** Either side -> server -> other side: WebRTC ICE candidate relay. */
export interface SignalCandidateMessage {
  type: "signal-candidate";
  callId: string;
  candidate: RTCIceCandidateInit;
}

/** Either side -> server -> other side: end the call. */
export interface HangUpMessage {
  type: "hang-up";
  callId: string;
}

/** Server -> client: the account id they tried to call doesn't exist/isn't online. */
export interface CallErrorMessage {
  type: "call-error";
  callId?: string;
  message: string;
}

/** Server -> client: presence snapshot (currently online account ids), for UI only. */
export interface PresenceMessage {
  type: "presence";
  onlineAccountIds: string[];
}

export type ClientToServerMessage =
  | RegisterMessage
  | CallInviteMessage
  | CallResponseMessage
  | SignalDescriptionMessage
  | SignalCandidateMessage
  | HangUpMessage;

export type ServerToClientMessage =
  | IncomingCallMessage
  | CallResultMessage
  | SignalDescriptionMessage
  | SignalCandidateMessage
  | HangUpMessage
  | CallErrorMessage
  | PresenceMessage;
