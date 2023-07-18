import React, { useEffect } from 'react';
import Posts from '../Components/Posts'; // Importa o componente Posts
import { useState } from 'react'; // Importa o hook useState do React

const IndexPage = () => {
  const [posts, setPosts] = useState([]); // Define o estado 'posts' como um array vazio

  // Efeito colateral para buscar os posts quando o componente é montado
  useEffect(() => {
    fetch('http://localhost:4000/post').then((response) => {
      response.json().then((posts) => {
        setPosts(posts); // Atualiza o estado 'posts' com os posts obtidos do servidor
        console.log(posts); // Exibe os posts no console
      });
    });
  }, []);

  return (
    <>
      {/* Verifica se há posts e renderiza o componente Posts para cada post */}
      {posts.length > 0 &&
        posts.map((post) => (
          <Posts key={post._id} {...post} /> // Passa as propriedades do post como prop para o componente Posts
        ))}
    </>
  );
};

export default IndexPage;
