import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root container
const rootElement = document.getElementById('root');

// Ensure the container exists
if (rootElement) {
    // Create the root and render the App
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Root element with id 'root' not found!");
}
