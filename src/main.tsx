import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AudioProvider } from './context/AudioContext';
import { LibraryProvider } from './context/LibraryContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioProvider>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </AudioProvider>
  </React.StrictMode>
);
