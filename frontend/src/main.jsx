import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import {Toaster} from "@/components/ui/sonner.js";
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
      <Toaster/>
  </React.StrictMode>,
)
