import React from 'react'; // Importa o React
import { formatISO9075 } from 'date-fns'; // Importa a função formatISO9075 do date-fns para formatar datas
import { Link } from 'react-router-dom'; // Importa o componente Link do React Router DOM

const Posts = ({ _id, summary, title, content, cover, createdAt, author }) => {
  console.log(author); // Exibe o autor do post no console (apenas para fins de depuração)

  return (
    <div className="post">
      <div className="image">
        {/* Cria um link para visualizar o post individual com base no seu ID */}
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/' + cover} alt="Capa do post" /> {/* Exibe a imagem de capa do post */}
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2> {/* Exibe o título do post */}
        </Link>
        <p className="info">
          <a href="" className="author">
            {author.username}
          </a> {/* Exibe o nome de usuário do autor do post */}
          <time> {formatISO9075(new Date(createdAt))} </time> {/* Exibe a data de criação do post formatada */}
        </p>
        <p className="summary">{summary}</p> {/* Exibe o resumo do post */}
      </div>
    </div>
  );
};

export default Posts;
