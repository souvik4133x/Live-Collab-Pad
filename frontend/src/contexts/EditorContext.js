import React, { createContext, useContext, useReducer } from 'react';

const EditorContext = createContext();

const initialState = {
  currentRoom: null,
  content: '',
  users: {}, // Ensure users is always an object
  documents: {},
  currentDocument: 'main',
  connectionStatus: 'disconnected',
  username: 'Anonymous'
};

function editorReducer(state, action) {
  switch (action.type) {
    case 'JOIN_ROOM':
      return {
        ...state,
        currentRoom: action.payload.room,
        username: action.payload.username,
        users: {} // Reset users when joining new room
      };
    case 'LEAVE_ROOM':
      return initialState;
    case 'UPDATE_CONTENT':
      return {
        ...state,
        content: action.payload
      };
    case 'UPDATE_USERS':
      return {
        ...state,
        users: action.payload || {} // Ensure users is never null/undefined
      };
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: action.payload
      };
    case 'UPDATE_DOCUMENTS':
      return {
        ...state,
        documents: action.payload || {}
      };
    default:
      return state;
  }
}

export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}