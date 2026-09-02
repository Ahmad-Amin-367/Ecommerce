'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

// Parse base URL by stripping /api/v1 if present
const getSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
};

export function SocketProvider({ children }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socketUrl = getSocketUrl();
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from WebSocket server');
    });

    // Listen for product invalidations
    socket.on('invalidate_products', () => {
      console.log('🔄 Received invalidate_products event');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Also invalidate single products if they are open
      queryClient.invalidateQueries({ queryKey: ['product'] });
    });

    // Listen for testimonial/review invalidations
    socket.on('invalidate_testimonials', () => {
      console.log('🔄 Received invalidate_testimonials event');
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    });

    // Proper cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('invalidate_products');
      socket.off('invalidate_testimonials');
      socket.disconnect();
    };
  }, [queryClient]);

  return <>{children}</>;
}
