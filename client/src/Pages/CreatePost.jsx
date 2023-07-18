import { useState } from 'react'; // Importa o hook useState do React
import ReactQuill from 'react-quill'; // Importa o componente ReactQuill
import 'react-quill/dist/quill.snow.css'; // Importa o CSS do ReactQuill
import { Navigate } from 'react-router-dom'; // Importa o componente Navigate do React Router DOM
import Editor from '../Editor'; // Importa o componente Editor

const CreatePost = () => {
  // Definindo os estados iniciais
  const [title, setTitle] = useState(''); // Define o estado 'title' como uma string vazia
  const [summary, setSummary] = useState(''); // Define o estado 'summary' como uma string vazia
  const [content, setContent] = useState(''); // Define o estado 'content' como uma string vazia
  const [files, setFiles] = useState(''); // Define o estado 'files' como uma string vazia
  const [redirect, setRedirect] = useState(false); // Define o estado 'redirect' como falso

  // Função para criar um novo post
  async function createNewPost(ev) {
    ev.preventDefault(); // Evita o comportamento padrão do formulário

    // Criando uma instância de FormData para enviar os dados do formulário
    const data = new FormData();
    data.set('title', title); // Define o título no FormData
    data.set('summary', summary); // Define o resumo no FormData
    data.set('content', content); // Define o conteúdo no FormData
    data.set('file', files[0]); // Define o arquivo no FormData

    try {
      // Fazendo uma chamada assíncrona para a rota '/post' no servidor
      const response = await fetch('http://localhost:4000/post', {
        method: 'POST', // Define o método HTTP como POST para criar um novo post
        body: data, // Define o corpo da requisição como o FormData contendo os dados do post
        credentials: 'include', // Inclui os cookies na requisição
      });

      // Verificando o status da resposta
      const status = response.status || 500;

      if (response.ok) {
        setRedirect(true); // Define o estado 'redirect' como verdadeiro se a criação for bem-sucedida

        if (response.type === 'application/json') {
          // Se a resposta for JSON, convertemos para objeto e exibimos no console
          const jsonData = await response.json();
          console.log('Resposta JSON:', jsonData);
        } else {
          // Se a resposta for texto, fazemos o parse e exibimos no console
          const textData = await response.text();
          const fileData = JSON.parse(textData);
          console.log('Dados do arquivo:', fileData);
          console.log('Caminho do arquivo:', fileData.file.path);
          console.log('Tamanho do arquivo:', fileData.file.size);
        }
      } else {
        // Se a resposta não estiver OK, exibimos o status no console
        console.log('Erro na resposta:', status);
      }
    } catch (error) {
      // Tratando erros durante a chamada fetch
      console.log('Erro na chamada fetch:', error);
    }
  }

  // Se a criação for bem-sucedida, redireciona para a página inicial
  if (redirect) {
    return <Navigate to={'/'} />; // Navega para a página inicial
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)} // Atualiza o estado 'title' quando o valor do input muda
      />
      <input
        type="text"
        placeholder="Resumo"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)} // Atualiza o estado 'summary' quando o valor do input muda
      />
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)} // Atualiza o estado 'files' quando o valor do input muda
      />

      <Editor onChange={setContent} value={content} /> {/* Renderiza o componente Editor para editar o conteúdo do post */}
      <button style={{ marginTop: '10px' }}>Crie o Post</button>
    </form>
  )
}

export default CreatePost;
