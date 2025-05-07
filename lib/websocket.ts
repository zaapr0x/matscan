'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type Transaction = {
  title: string;
  timestamp: number;
  amount: string;
  sender: string;
  receiver: string;
  txid: string;
  type?: string;
};

type UseSocket = (
  url: string,
  onTransaction: (data: Transaction) => void,
  onConnect?: () => void
) => React.MutableRefObject<Socket | null>;

const useSocket: UseSocket = (url, onTransaction, onConnect) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket'],
      reconnection: true,              // <--- enable reconnection
      reconnectionAttempts: 5,         // <--- max attempts
      reconnectionDelay: 1000,         // <--- 1 second delay between retries
      reconnectionDelayMax: 5000,      // <--- max 5 seconds
    });

    socket.on('connect', () => {
      console.log('✅ Connected to', url);
      if (onConnect) onConnect();
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Disconnected:', reason);
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}`);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
    });

    socket.on('reconnect', (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempt(s)`);
    });

    socket.on('new_transaction', (data: Transaction) => {
      onTransaction(data);
      console.log(data);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [url, onTransaction, onConnect]);

  return socketRef;
};

export default useSocket;
