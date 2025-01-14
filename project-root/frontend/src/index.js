import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  const handleLocation = () => {
    if (window.location.search[1] === '/') {
      const decoded = window.location.search.slice(1).split('&').map((s) => {
        return s.replace(/~and~/g, '&');
      }).join('?');
      window.history.replaceState(null, null,
        window.location.pathname.slice(0, -1) + decoded + window.location.hash
      );
    }
  };
  handleLocation();

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found!");
}
