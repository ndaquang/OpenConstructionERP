import { describe, it, expect, vi } from 'vitest';
import { closeWebSocket } from '../closeWebSocket';

function fakeSocket(readyState: number) {
  const target = new EventTarget();
  const socket = Object.assign(target, {
    readyState,
    close: vi.fn(),
  });
  return socket as unknown as WebSocket & { close: ReturnType<typeof vi.fn> };
}

describe('closeWebSocket', () => {
  it('closes an open socket straight away', () => {
    const socket = fakeSocket(WebSocket.OPEN);
    closeWebSocket(socket);
    expect(socket.close).toHaveBeenCalledTimes(1);
  });

  it('defers the close of a connecting socket until it opens', () => {
    const socket = fakeSocket(WebSocket.CONNECTING);
    closeWebSocket(socket);
    expect(socket.close).not.toHaveBeenCalled();
    socket.dispatchEvent(new Event('open'));
    expect(socket.close).toHaveBeenCalledTimes(1);
  });

  it('does nothing for a socket that failed before opening', () => {
    const socket = fakeSocket(WebSocket.CLOSED);
    closeWebSocket(socket);
    expect(socket.close).not.toHaveBeenCalled();
  });

  it('accepts a missing socket', () => {
    expect(() => closeWebSocket(null)).not.toThrow();
    expect(() => closeWebSocket(undefined)).not.toThrow();
  });
});
