import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Find the root container
const rootElement = document.getElementById('root');

// Ensure the container exists
if (rootElement) {
  // Create the root
  const root = ReactDOM.createRoot(rootElement);

  // Add the script to handle the URL
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

  // Render the App
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found!");
}