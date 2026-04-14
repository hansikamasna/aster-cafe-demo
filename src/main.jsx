import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CafeProvider } from './store/CafeStore';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CafeProvider>
        <App />
      </CafeProvider>
    </BrowserRouter>
  </React.StrictMode>
);