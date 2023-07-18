import React from 'react'; // Importa o React
import Header from './Header'; // Importa o componente Header
import { Outlet } from 'react-router-dom'; // Importa o componente Outlet do React Router DOM

const Layout = () => {
  return (
    <main>
      {/* Renderiza o componente Header no topo da página */}
      <Header />
      {/* Renderiza o componente filho definido no roteamento (o conteúdo da página atual) */}
      <Outlet />
    </main>
  );
}

export default Layout;
