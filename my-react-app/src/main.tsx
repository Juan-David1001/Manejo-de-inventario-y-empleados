import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { NextUIProvider } from '@nextui-org/react';
import './index.css'; // Asegúrate de que la ruta del archivo sea correcta

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <NextUIProvider>
    <Router>
      <App />
    </Router>
  </NextUIProvider>
);
