import { randomUUID } from 'crypto';

export type SessionRole = 'user' | 'admin';

export interface ServerSession {
  sid: string;
  token: string;
  role: SessionRole;
  expiresAt: number;
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24h

declare global {
  // eslint-disable-next-line no-var
  var __tivitSessions: Map<string, ServerSession> | undefined;
}

const sessionStore = global.__tivitSessions ?? new Map<string, ServerSession>();
if (!global.__tivitSessions) {
  global.__tivitSessions = sessionStore;
}

export function createServerSession(input: { token: string; role: SessionRole }): ServerSession {
  const sid = randomUUID();
  const session: ServerSession = {
    sid,
    token: input.token,
    role: input.role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  sessionStore.set(sid, session);
  return session;
}

export function getServerSessionBySid(sid: string): ServerSession | null {
  const session = sessionStore.get(sid);
  if (!session) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    sessionStore.delete(sid);
    return null;
  }

  return session;
}

export function deleteServerSession(sid: string) {
  sessionStore.delete(sid);
}
