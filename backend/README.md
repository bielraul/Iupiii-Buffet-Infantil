# Backend Iupiii Buffet - PHP & MySQL

Este é o backend para o gerenciamento da galeria de fotos do site Iupiii Buffet Infantil.

## Estrutura de Pastas
- `config/`: Conexão com o banco de dados.
- `api/`: Endpoints que retornam JSON para o React.
- `uploads/`: Pasta onde as imagens enviadas serão armazenadas.
- `sql/`: Script para criação das tabelas no MySQL.

## Como Rodar Localmente (XAMPP)

1.  **Banco de Dados:**
    - Abra o **phpMyAdmin**.
    - Crie um banco de dados chamado `iupiii`.
    - Importe o arquivo `sql/banco.sql` ou execute o conteúdo dele no console SQL.

2.  **Arquivos do Backend:**
    - Copie a pasta `backend/` para dentro da pasta `htdocs/` do seu XAMPP.
    - O caminho sugerido é `C:/xampp/htdocs/iupiii-backend/`.
    - Certifique-se de que a pasta `uploads/galeria/` tenha permissão de escrita.

3.  **Configuração de Conexão:**
    - Se o seu MySQL não tiver senha (padrão do XAMPP), o arquivo `config/conexao.php` já está pronto.
    - Se você usa uma senha ou porta diferente, ajuste as variáveis no início deste arquivo.

4.  **Front-end (React):**
    - O serviço no React (`src/services/galeriaService.ts`) está configurado para apontar para `http://localhost/iupiii-backend/api/galeria`.
    - Se você mudou o nome da pasta no `htdocs`, atualize a constante `API_BASE_URL` no arquivo do serviço.

## Endpoints Disponíveis
- `GET api/galeria/listar.php`: Lista todas as fotos.
- `POST api/galeria/salvar.php`: Faz upload de imagem e salva dados.
- `POST api/galeria/editar.php`: Edita legenda, unidade e ordem.
- `POST api/galeria/excluir.php`: Exclui arquivo e registro.

---
Desenvolvido para Iupiii Buffet Infantil.
