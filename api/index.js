const express = require("express"); // Importa o módulo express
const app = express(); // Cria uma instância do aplicativo Express
const cors = require('cors'); // Importa o módulo cors para lidar com a política de mesmo-origem (CORS)
const mongoose = require("mongoose"); // Importa o módulo mongoose para se conectar ao banco de dados MongoDB
const User = require('./Models/User'); // Importa o modelo de usuário definido em ./Models/User
const Post = require('./Models/Post'); // Importa o modelo de post definido em ./Models/Post
const bcrypt = require('bcryptjs'); // Importa o módulo bcrypt para lidar com o hashing de senhas
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para lidar com autenticação via tokens JWT
const cookieParser = require('cookie-parser'); // Importa o módulo cookie-parser para analisar cookies
const multer = require('multer'); // Importa o módulo multer para lidar com o upload de arquivos
const upload = multer({ dest: './uploads/' }); // Configura o destino dos arquivos enviados pelo multer
const fs = require('fs'); // Importa o módulo fs para lidar com operações de arquivo

require('dotenv').config();



const salt = bcrypt.genSaltSync(10); // Gera um "salt" para o bcrypt
const secret = 'aoisjaoiIAOISaoimaso2123ASAOX'; // Define uma chave secreta para assinar tokens JWT

app.use(cors({ credentials: true, origin: 'http://localhost:5173' })); // Configura o middleware cors para permitir solicitações de origens específicas
app.use(express.json()); // Configura o middleware express.json para analisar o corpo das solicitações como JSON
app.use(cookieParser()); // Configura o middleware cookie-parser para analisar os cookies das solicitações
app.use('/uploads', express.static(__dirname + '/uploads')); // Configura o middleware express.static para servir arquivos estáticos na rota /uploads

mongoose.connect(process.env.MONGODB_URI)
 // Conecta-se ao banco de dados MongoDB usando o mongoose
//teste para ver se a api está online
app.get('/', (req, res)=> {
  res.json("api online")
})
// Rota para registrar um usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body; // Obtém o nome de usuário e senha do corpo da solicitação
  try {
    const userDoc = await User.create({ // Cria um documento de usuário usando o modelo User
      username,
      password: bcrypt.hashSync(password, salt) // Hash da senha usando bcrypt antes de armazenar no banco de dados
    });
    res.json(userDoc); // Retorna o documento de usuário criado como resposta
  } catch (err) {
    res.status(400).json(err); // Retorna um erro 400 se houver algum erro durante o registro
  }
});

// Rota para fazer login
app.post('/login', async (req, res) => {
  const { username, password } = req.body; // Obtém o nome de usuário e senha do corpo da solicitação
  const userDoc = await User.findOne({ username }); // Procura um usuário com o nome de usuário fornecido no banco de dados
  if (!userDoc) {
    res.status(400).json("Usuário não encontrado"); // Retorna um erro 400 se o usuário não for encontrado
    return;
  }

  if (!userDoc.password) {
    res.status(400).json("Senha não definida"); // Retorna um erro 400 se a senha não estiver definida para o usuário
    return;
  }

  const passOk = bcrypt.compareSync(password, userDoc.password); // Compara a senha fornecida com a senha armazenada usando bcrypt

  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => { // Gera um token JWT contendo o nome de usuário e o ID do usuário
      if (err) throw err;
      res.cookie('token', token).json({ // Define o token JWT como um cookie e retorna as informações do usuário
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Credenciais incorretas"); // Retorna um erro 400 se as credenciais forem incorretas
  }
});

// Rota para obter o perfil do usuário
app.get('/profile', (req, res) => {
  const { token } = req.cookies; // Obtém o token JWT do cookie
  jwt.verify(token, secret, {}, (err, info) => { // Verifica e decodifica o token JWT
    if (err) throw err;
    res.json(info); // Retorna as informações decodificadas do usuário
  });
});

// Rota para fazer logout
app.post('/logout', (req, res) => {
  res.cookie("token", '').json('ok'); // Limpa o cookie do token e retorna uma resposta "ok"
});

// Rota para criar um novo post
app.post('/post', upload.single('file'), async (req, res) => {
  if (req.file && req.file.originalname) { // Verifica se um arquivo foi enviado na solicitação
    const { originalname, path } = req.file; // Obtém o nome original e o caminho do arquivo
    const parts = originalname.split('.'); // Separa o nome do arquivo em partes usando o caractere "."
    const ext = parts[parts.length - 1]; // Obtém a extensão do arquivo a partir da última parte
    const newPath = path + '.' + ext; // Adiciona a extensão ao caminho do arquivo
    fs.renameSync(path, newPath); // Renomeia o arquivo para incluir a extensão

    const { token } = req.cookies; // Obtém o token JWT do cookie
    jwt.verify(token, secret, {}, async (err, info) => { // Verifica e decodifica o token JWT
      if (err) throw err;
      const { title, summary, content } = req.body; // Obtém o título, resumo e conteúdo do post do corpo da solicitação
      console.log(info.id);
      const postDoc = await Post.create({ // Cria um documento de post usando o modelo Post
        title,
        summary,
        content,
        cover: newPath,
        author: info.id, // Define o autor do post como o ID do usuário decodificado do token JWT
      });

      res.json(postDoc); // Retorna o documento de post criado como resposta
    });
  } else {
    res.status(400).json({ error: 'Arquivo inválido' }); // Retorna um erro 400 se o arquivo for inválido ou não fornecido
  }
});

// Rota para atualizar um post existente
app.put('/post/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params; // Obtém o ID do post da URL
  const { token } = req.cookies; // Obtém o token JWT do cookie
  jwt.verify(token, secret, {}, async (err, info) => { // Verifica e decodifica o token JWT
    if (err) throw err;
    const { title, summary, content } = req.body; // Obtém o título, resumo e conteúdo atualizados do post do corpo da solicitação
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file; // Obtém o nome original e o caminho do novo arquivo
      const parts = originalname.split('.'); // Separa o nome do arquivo em partes usando o caractere "."
      const ext = parts[parts.length - 1]; // Obtém a extensão do arquivo a partir da última parte
      newPath = path + '.' + ext; // Adiciona a extensão ao caminho do arquivo
      fs.renameSync(path, newPath); // Renomeia o arquivo para incluir a extensão
    }
    const postDoc = await Post.findById(id); // Encontra o post pelo ID no banco de dados
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id); // Verifica se o usuário decodificado do token JWT é o autor do post
    if (!isAuthor) {
      return res.status(401).json("Você não tem permissão para editar este post"); // Retorna um erro 401 se o usuário não for o autor do post
    }
    postDoc.title = title; // Atualiza o título do post
    postDoc.summary = summary; // Atualiza o resumo do post
    postDoc.content = content; // Atualiza o conteúdo do post
    postDoc.cover = newPath ? newPath : postDoc.cover; // Atualiza a capa do post, se um novo arquivo foi enviado
    await postDoc.save(); // Salva as alterações no post no banco de dados
    res.json(postDoc); // Retorna o post atualizado como resposta
  });
});

// Rota para obter todos os posts
app.get('/post', async (req, res) => {
  const posts = await Post.find() // Obtém todos os posts do banco de dados
    .populate('author', 'username') // Popula o campo 'author' do post com o nome de usuário do autor
    .sort({ createdAt: -1 }) // Classifica os posts por ordem decrescente de criação
    .limit(20); // Limita o número de posts retornados
  res.json(posts); // Retorna os posts como resposta
});

// Rota para obter um post específico pelo ID
app.get('/post/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do post da URL
  const post = await Post.findById(id).populate('author', ['username']); // Encontra o post pelo ID no banco de dados e popula o campo 'author' com o nome de usuário do autor
  res.json(post); // Retorna o post encontrado como resposta
});

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Encontre o post pelo ID e exclua-o do banco de dados
    await Post.findByIdAndDelete(id);
    // Responda com uma mensagem de sucesso se a exclusão for bem-sucedida
    res.json({ message: 'Post excluído com sucesso' });
  } catch (err) {
    // Se ocorrer um erro, responda com uma mensagem de erro e status 400
    res.status(400).json({ error: 'Ocorreu um erro ao excluir o post' });
  }
});

// Rota para visualizar todos os usuários registrados
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Recupera todos os usuários do banco de dados
    res.json(users); // Retorna os usuários como resposta em formato JSON
  } catch (err) {
    res.status(500).json({ error: 'Ocorreu um erro ao recuperar os usuários' });
  }
});



app.listen(4000); // Inicia o servidor na porta 4000



//'mongodb+srv://igorbrandaao:tdIbZheiz3c8aKYu@cluster0.grwpzz9.mongodb.net/mern%20blog'
//tdIbZheiz3c8aKYu
