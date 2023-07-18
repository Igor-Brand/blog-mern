const mongoose = require('mongoose'); // Importa o módulo mongoose para interagir com o MongoDB
const { Schema, model } = mongoose; // Importa o Schema e o model do mongoose para definir o modelo do documento

const PostSchema = new Schema({
  title: String, // Define o campo 'title' como uma string
  summary: String, // Define o campo 'summary' como uma string
  content: String, // Define o campo 'content' como uma string
  cover: String, // Define o campo 'cover' como uma string
  author: {
    // Define o campo 'author' como um objeto relacionado a outro modelo 'User'
    type: Schema.Types.ObjectId, // Define o tipo do campo como um ObjectId (ID de outro documento)
    ref: 'User', // Define a referência ao modelo 'User'
  },
}, {
  timestamps: true, // Define a opção 'timestamps' como true para que o Mongoose adicione automaticamente campos de data de criação e atualização ao documento
});

const PostModel = model('Post', PostSchema); // Cria o modelo 'Post' usando o schema 'PostSchema'

module.exports = PostModel; // Exporta o modelo 'PostModel' para ser usado em outras partes da aplicação
