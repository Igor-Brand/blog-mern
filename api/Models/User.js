const mongoose = require('mongoose'); // Importa a biblioteca mongoose para trabalhar com o MongoDB
const { Schema, model } = mongoose; // Extrai os objetos Schema e model do mongoose

const UserSchema = new Schema({
  username: {
    type: String,
    required: true, // Define que o campo é obrigatório
    minlength: 4, // Define o tamanho mínimo do campo
    unique: true, // Define que o valor do campo deve ser único
  },
  password: {
    type: String,
    required: true, // Define que o campo é obrigatório
  },
});

const UserModel = model('User', UserSchema); // Cria um modelo 'User' usando o esquema 'UserSchema'

module.exports = UserModel; // Exporta o modelo 'User' para uso em outras partes do código
