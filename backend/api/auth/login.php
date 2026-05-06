<?php
/**
 * API: Login de Administrador
 */

require_once "../../config/conexao.php";

configurarCabecalhos();
session_start();

// Aceitar JSON
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    $dados = $_POST;
}

$email = isset($dados['email']) ? trim($conn->real_escape_string($dados['email'])) : '';
$senha = isset($dados['senha']) ? $dados['senha'] : '';

if (empty($email) || empty($senha)) {
    responderJSON(false, "E-mail e senha são obrigatórios.");
}

// 1. Buscar usuário no banco
$stmt = $conn->prepare("SELECT id, email, senha, nome FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();

if (!$usuario) {
    responderJSON(false, "Usuário não encontrado.");
}

// 2. Verificar senha
// Nota: O hash no banco deve ter sido gerado com password_hash()
if (password_verify($senha, $usuario['senha'])) {
    
    // 3. Iniciar sessão
    $_SESSION['admin_logado'] = true;
    $_SESSION['admin_id'] = $usuario['id'];
    $_SESSION['admin_nome'] = $usuario['nome'];
    $_SESSION['admin_email'] = $usuario['email'];

    responderJSON(true, "Login realizado com sucesso!", [
        "id" => $usuario['id'],
        "nome" => $usuario['nome'],
        "email" => $usuario['email']
    ]);
} else {
    responderJSON(false, "Senha incorreta.");
}

$stmt->close();
$conn->close();
?>
