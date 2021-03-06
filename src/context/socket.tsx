import { io } from "socket.io-client";
import { SOCKET_URL } from "config";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

export const SocketIOContext = createContext(undefined);
export const useSocket = () => useContext(SocketIOContext);

export const useSocketEvent = (
  eventKey?: string,
  callback?: (...args) => void
) => {
  const socket = useSocket();
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const socketHandlerRef = useRef(function (args) {
    if (callbackRef.current) {
      callbackRef.current(args);
      // callbackRef.current.apply(this, ...args);
    }
  });

  const subscribe = useCallback(() => {
    if (eventKey) {
      socket.on(eventKey, socketHandlerRef.current);
    }
  }, [eventKey, socket]);

  const unsubscribe = useCallback(() => {
    if (eventKey) {
      socket.off(eventKey, socketHandlerRef.current);
    }
  }, [eventKey, socket]);

  useEffect(() => {
    subscribe();

    return unsubscribe;
  }, [eventKey, subscribe, unsubscribe]);

  return { socket, unsubscribe, subscribe };
};

const SocketProvider = ({ children, opts = { transports: ["polling"] } }) => {
  const socketRef = useRef(null);

  console.log({ socketRef });

  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, opts);
  }
  return (
    <SocketIOContext.Provider value={socketRef.current}>
      {children}
    </SocketIOContext.Provider>
  );
};

export default SocketProvider;
