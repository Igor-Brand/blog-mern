import React from 'react'; // Importa o React
import ReactQuill from 'react-quill'; // Importa o componente ReactQuill

const Editor = ({ value, onChange }) => {
  // Configurações dos módulos para a barra de ferramentas do editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <ReactQuill
      value={value} // O conteúdo atual do editor
      theme={'snow'} // Define o tema do editor para "snow" (claro)
      modules={modules} // Passa os módulos de configuração da barra de ferramentas
      onChange={onChange} // Função chamada sempre que o conteúdo do editor é alterado
    />
  );
};

export default Editor;
