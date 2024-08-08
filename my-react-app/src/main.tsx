import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { NextUIProvider } from '@nextui-org/react';
import './index.css'; 
import React from 'react';


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode> {/* Add StrictMode for development checks */}
    <NextUIProvider>
      <Router>
        <App />
      </Router>
    </NextUIProvider>
  </React.StrictMode>
);
