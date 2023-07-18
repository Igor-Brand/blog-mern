import React from 'react'; // Importa o React
import ReactDOM from 'react-dom/client'; // Importa o ReactDOM para renderizar a aplicação no DOM
import App from './App.jsx'; // Importa o componente principal "App"
import { BrowserRouter } from 'react-router-dom'; // Importa o BrowserRouter para lidar com as rotas da aplicação

// Renderiza a aplicação dentro do elemento com ID "root" no DOM
// usando o ReactDOM.createRoot() para habilitar recursos futuros do React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* Renderiza o componente principal "App" dentro do BrowserRouter */}
    </BrowserRouter>
  </React.StrictMode>,
);
