import React, { useContext, useEffect, useState } from 'react'; // Importa os hooks e componentes do React
import { Link } from 'react-router-dom'; // Importa o componente Link do React Router DOM
import { UserContext } from '../UserContext'; // Importa o contexto do usuário

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext); // Obtém as informações do usuário do contexto
  useEffect(() => {
    // UseEffect para fazer uma chamada assíncrona quando o componente é montado
    fetch('http://localhost:4000/profile', {
      credentials: 'include', // Inclui os cookies na requisição
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo); // Atualiza as informações do usuário no contexto
      });
    });
  }, []);

  function logout() {
    // Função para efetuar o logout do usuário
    fetch('http://localhost:4000/logout', {
      credentials: 'include', // Inclui os cookies na requisição
      method: 'POST', // Define o método HTTP como POST para fazer logout
    });
    setUserInfo(null); // Define as informações do usuário como nulas no contexto, efetuando o logout
  }

  const username = userInfo?.username; // Obtém o nome de usuário do usuário logado (se existir)

  return (
    <header>
      <Link to={"/"} className='logo'>
        BlogIgor
      </Link>
      <nav>
        {/* Renderiza links e opções de navegação com base no estado do usuário */}
        {username && (
          <>
            <span>Olá, {username}</span>
            <Link to="/create">Criar</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
