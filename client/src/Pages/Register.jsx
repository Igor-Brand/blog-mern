import React, { useState } from 'react';

const Register = () => {
  // Define os estados locais 'username' e 'password' utilizando o hook 'useState'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Função assíncrona para lidar com o registro do usuário
  async function register(ev) {
    ev.preventDefault(); // Evita o comportamento padrão do envio do formulário

    // Faz uma solicitação para o servidor para registrar o usuário
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }), // Converte os dados para JSON e os envia como corpo da requisição
      headers: { 'Content-type': 'application/json' }, // Define o cabeçalho da requisição para indicar que os dados são JSON
    });

    // Verifica se a resposta do servidor não foi bem-sucedida (status diferente de 200)
    if (response.status !== 200) {
      alert("Registro falhou!"); // Exibe uma mensagem de erro caso o registro não tenha sido bem-sucedido
    } else {
      alert("Usuário registrado com sucesso!"); // Exibe uma mensagem de sucesso caso o registro tenha sido bem-sucedido
    }
  }

  return (
    <form className='register' onSubmit={register}>
      <h1>Register</h1>
      {/* Campo de entrada para o nome de usuário */}
      <input
        type="text"
        placeholder='Usuário'
        value={username} // Define o valor do campo com o estado 'username'
        onChange={(ev) => setUsername(ev.target.value)} // Atualiza o estado 'username' quando o campo é modificado
      />
      {/* Campo de entrada para a senha */}
      <input
        type="password"
        placeholder='Senha'
        value={password} // Define o valor do campo com o estado 'password'
        onChange={(ev) => setPassword(ev.target.value)} // Atualiza o estado 'password' quando o campo é modificado
      />
      <button>Register</button> {/* Botão para enviar o formulário */}
    </form>
  );
};

export default Register;
