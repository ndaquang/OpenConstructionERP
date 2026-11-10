/**
 * Close a WebSocket from an effect cleanup without the browser's
 * "WebSocket is closed before the connection is established" error.
 *
 * In development React runs effects twice (StrictMode), so the first socket is
 * often still CONNECTING when its cleanup runs. Closing a CONNECTING socket
 * makes the browser report an error, so the close waits for the open event.
 * A socket that fails before opening needs no close: it is already gone.
 */
export function closeWebSocket(socket: WebSocket | null | undefined): void {
  if (!socket) return;
  if (socket.readyState === WebSocket.CONNECTING) {
    socket.addEventListener('open', () => socket.close(), { once: true });
    return;
  }
  if (socket.readyState === WebSocket.OPEN) {
    try {
      socket.close();
    } catch {
      // Already closing; nothing left to do.
    }
  }
}
