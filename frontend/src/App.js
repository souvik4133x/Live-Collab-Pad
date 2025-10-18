import React from 'react';
import { EditorProvider } from './contexts/EditorContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import JoinRoom from './components/editor/JoinRoom';
import Editor from './components/editor/Editor';
import UserList from './components/editor/UserList';
import RoomInfo from './components/editor/RoomInfo';
import { useEditor } from './contexts/EditorContext';

function AppContent() {
  const { state } = useEditor();

  if (!state.currentRoom) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <JoinRoom />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <div className="main-layout">
        <aside className="sidebar">
          <RoomInfo />
          <UserList />
        </aside>
        <main className="main-content">
          <Editor />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <EditorProvider>
      <AppContent />
    </EditorProvider>
  );
}

export default App;