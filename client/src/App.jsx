import './App.css'; // Importa o arquivo de estilos do componente App
import IndexPage from './Pages/IndexPage'; // Importa o componente para a página inicial
import { Route, Routes } from 'react-router-dom'; // Importa os componentes para definir as rotas da aplicação
import Login from './Pages/Login'; // Importa o componente para a página de login
import Register from './Pages/Register'; // Importa o componente para a página de registro
import Layout from './Components/Layout'; // Importa o componente para o layout geral da aplicação
import { UserContextProvider } from './UserContext'; // Importa o componente para o contexto do usuário
import CreatePost from './Pages/CreatePost'; // Importa o componente para a página de criação de posts
import Post from './Pages/Post'; // Importa o componente para a página de visualização de um post
import Edit from './Pages/Edit'; // Importa o componente para a página de edição de um post

function App() {
  return (
    <UserContextProvider> {/* Define o contexto do usuário usando o componente UserContextProvider */}
      <Routes>
        {/* Define as rotas da aplicação */}
        <Route path="/" element={<Layout />}> {/* Define a rota raiz com o componente Layout como layout geral */}
          <Route index element={<IndexPage />} /> {/* Define a rota para a página inicial */}
          <Route path="/login" element={<Login />} /> {/* Define a rota para a página de login */}
          <Route path="/register" element={<Register />} /> {/* Define a rota para a página de registro */}
          <Route path="/create" element={<CreatePost />} /> {/* Define a rota para a página de criação de posts */}
          <Route path="/post/:id" element={<Post />} /> {/* Define a rota para a página de visualização de um post */}
          <Route path="/edit/:id" element={<Edit />} /> {/* Define a rota para a página de edição de um post */}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
