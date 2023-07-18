import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';
import { UserContext } from '../UserContext';

const Post = () => {
  const { id } = useParams(); // Obtém o parâmetro de rota 'id' que identifica o post a ser exibido
  const [post, setPost] = useState(null); // Define o estado 'post' como nulo, inicialmente não temos um post carregado
  const { userInfo } = useContext(UserContext); // Obtém as informações do usuário do contexto 'UserContext'
  const [isDeleted, setIsDeleted] = useState(false); // Define o estado 'isDeleted' como falso, inicialmente o post não foi excluído
  const navigate = useNavigate(); // Obtém a função de navegação do React Router DOM

  useEffect(() => {
    // UseEffect é usado para lidar com efeitos colaterais, nesse caso, faz uma solicitação para obter os detalhes do post
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        response.json()
          .then(post => {
            setPost(post); // Atualiza o estado 'post' com os detalhes do post recebido da resposta
            console.log(post); // Exibe os detalhes do post no console para fins de depuração
          });
      });
  }, []);

  const handleDeletePost = async () => {
    // Essa função é chamada quando o usuário clica no botão 'Delete' para excluir o post
    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: 'DELETE', // Faz uma solicitação de exclusão usando o método HTTP DELETE
        credentials: 'include', // Inclui os cookies na solicitação para autenticação
      });
      if (response.ok) {
        setIsDeleted(true); // Define o estado 'isDeleted' como verdadeiro se a exclusão for bem-sucedida
      }
    } catch (err) {
      console.log(err); // Exibe qualquer erro no console para fins de depuração
    }
  };

  useEffect(() => {
    // UseEffect que monitora as alterações no estado 'isDeleted' e redireciona o usuário de volta para a página inicial após a exclusão
    if (isDeleted) {
      navigate('/'); // Navega para a página inicial usando a função 'navigate' do React Router DOM
    }
  }, [isDeleted, navigate]);

  if (!post) return ''; // Se o post ainda não foi carregado, retorna uma string vazia para evitar erros de renderização

  return (
    <div className="post-page">
      <h1>{post.title}</h1> {/* Exibe o título do post */}
      <time>{formatISO9075(new Date(post.createdAt))}</time> {/* Exibe a data de criação do post formatada */}
      <div className="author">por {post.author.username}</div> {/* Exibe o nome de usuário do autor do post */}
      {userInfo.id === post.author._id && ( // Renderiza as opções de configuração apenas se o usuário atual for o autor do post
        <div className="config">
          <Link className="edit" to={`/edit/${post._id}`}> {/* Cria um link para a página de edição do post */}
            Edite
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </Link>
          <Link className="delete" onClick={handleDeletePost}> {/* Cria um link que aciona a função 'handleDeletePost' quando clicado */}
            Delete
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/${post.cover}`} alt="" /> {/* Exibe a imagem de capa do post */}
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} /> {/* Exibe o conteúdo do post (HTML) */}
    </div>
  );
};

export default Post;
