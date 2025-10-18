import { useEffect, useRef } from 'react';
import { useEditor } from '../contexts/EditorContext';
import { WS_URL } from '../utils/constants';

export function useWebSocket() {
  const { state, dispatch } = useEditor();
  const ws = useRef(null);

  useEffect(() => {
    if (!state.currentRoom) return;

    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(
          `${WS_URL}/ws/${state.currentRoom}?username=${encodeURIComponent(state.username)}`
        );

        ws.current.onopen = () => {
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'content_update':
              dispatch({ type: 'UPDATE_CONTENT', payload: data.content });
              break;
            case 'room_state':
              dispatch({ type: 'UPDATE_CONTENT', payload: data.content || '' });
              dispatch({ type: 'UPDATE_USERS', payload: data.users || {} });
              dispatch({ type: 'UPDATE_DOCUMENTS', payload: data.documents || {} });
              break;
            case 'user_joined':
            case 'user_left':
              dispatch({ type: 'UPDATE_USERS', payload: data.users || {} });
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        };

        ws.current.onclose = () => {
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'error' });
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [state.currentRoom, state.username, dispatch]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
}