import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom'; // Importa o componente Navigate do React Router DOM
import { UserContext } from '../UserContext'; // Importa o contexto do usuário

const Login = () => {
  const { setUserInfo } = useContext(UserContext); // Obtém a função setUserInfo do contexto do usuário
  const [username, setUsername] = useState(''); // Define o estado 'username' como uma string vazia
  const [password, setPassword] = useState(''); // Define o estado 'password' como uma string vazia
  const [redirect, setRedirect] = useState(false); // Define o estado 'redirect' como falso

  // Função assíncrona para lidar com o login do usuário
  async function login(ev) {
    ev.preventDefault(); // Evita o comportamento padrão do envio do formulário

    // Faz uma solicitação para o servidor para efetuar o login do usuário
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST', // Define o método HTTP como POST
      body: JSON.stringify({ username, password }), // Converte os dados para JSON e os envia como corpo da requisição
      headers: { 'Content-Type': 'application/json' }, // Define o cabeçalho da requisição para indicar que os dados são JSON
      credentials: 'include', // Inclui os cookies na solicitação
    });

    // Verifica se a resposta do servidor é bem-sucedida (status 200)
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo); // Atualiza o contexto do usuário com as informações do usuário logado
        setRedirect(true); // Define o estado 'redirect' como verdadeiro para redirecionar o usuário
      });

      setRedirect(true); // Define o estado 'redirect' como verdadeiro para redirecionar o usuário
    } else {
      const error = await response.json(); // Converte a resposta de erro em formato JSON
      console.log(error); // Exibe o erro no console
    }
  }

  // Se 'redirect' for verdadeiro, redireciona o usuário para a página inicial
  if (redirect) {
    return <Navigate to={'/'} />; // Utiliza o componente Navigate para redirecionar o usuário
  }

  return (
    <form className='login' onSubmit={login}>
      <h1>Login</h1>
      {/* Campo de entrada para o nome de usuário */}
      <input
        type='text'
        placeholder='Usuário'
        value={username} // Define o valor do campo com o estado 'username'
        onChange={(ev) => setUsername(ev.target.value)} // Atualiza o estado 'username' quando o campo é modificado
      />
      {/* Campo de entrada para a senha */}
      <input
        type='password'
        placeholder='Senha'
        value={password} // Define o valor do campo com o estado 'password'
        onChange={(ev) => setPassword(ev.target.value)} // Atualiza o estado 'password' quando o campo é modificado
      />
      <button>Login</button> {/* Botão para enviar o formulário */}
    </form>
  );
};

export default Login;
