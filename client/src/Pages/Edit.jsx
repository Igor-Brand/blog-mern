import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom'; // Importa o hook useParams e o componente Navigate do React Router DOM
import Editor from '../Editor'; // Importa o componente Editor

const Edit = () => {
    const { id } = useParams(); // Obtém o parâmetro de rota 'id'
    const [title, setTitle] = useState(''); // Define o estado 'title' como uma string vazia
    const [summary, setSummary] = useState(''); // Define o estado 'summary' como uma string vazia
    const [content, setContent] = useState(''); // Define o estado 'content' como uma string vazia
    const [files, setFiles] = useState(''); // Define o estado 'files' como uma string vazia
    const [redirect, setRedirect] = useState(false); // Define o estado 'redirect' como falso
    
    // Efeito colateral para buscar os detalhes do post pelo ID quando o componente é montado
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
        .then(res => {
        res.json().then(post => {
            setTitle(post.title); // Atualiza o estado 'title' com o título do post
            setSummary(post.summary); // Atualiza o estado 'summary' com o resumo do post
            setContent(post.content); // Atualiza o estado 'content' com o conteúdo do post
        });
    });
    }, []);

    // Função assíncrona para atualizar o post
    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title); // Define o título no FormData
        data.set('summary', summary); // Define o resumo no FormData
        data.set('content', content); // Define o conteúdo no FormData
        data.set('id', id); // Define o ID do post no FormData
        if (files?.[0])
            data.set('file', files?.[0]); // Define o arquivo no FormData, se existir
        const response = await fetch(`http://localhost:4000/post/${id}`, {
            method: 'PUT', // Define o método HTTP como PUT para atualizar o post
            body: data, // Define o corpo da requisição como o FormData contendo os dados do post
            credentials: 'include', // Inclui os cookies na requisição
        });
        if (response.ok) {
            setRedirect(true); // Define o estado 'redirect' como verdadeiro se a atualização for bem-sucedida
        }   
    }

    // Se a atualização for bem-sucedida, redireciona para a página do post
    if (redirect) {
        return <Navigate to={"/post/" + id} />; // Navega para a página do post com o ID atual
    }

    return (
        <form onSubmit={updatePost}>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />
            <input
                type="text"
                placeholder="Resumo"
                value={summary}
                onChange={(ev) => setSummary(ev.target.value)}
            />
            <input
                type="file"
                onChange={(ev) => setFiles(ev.target.files)}
            />

            <Editor onChange={setContent} value={content} /> {/* Renderiza o componente Editor para editar o conteúdo do post */}
            <button style={{ marginTop: '10px' }}>Atualize o Post</button>
        </form>
    )
}

export default Edit;
