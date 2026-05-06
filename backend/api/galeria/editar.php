<?php
/**
 * API: Editar metadados da foto
 * Atualiza legenda, unidade e ordem no banco
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

// Aceitar dados via POST ou JSON
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    $dados = $_POST;
}

$id = isset($dados['id']) ? (int)$dados['id'] : 0;
$legenda = isset($dados['legenda']) ? trim($conn->real_escape_string($dados['legenda'])) : '';
$unidade = isset($dados['unidade']) ? trim($conn->real_escape_string($dados['unidade'])) : '';
$ordem = isset($dados['ordem']) ? (int)$dados['ordem'] : 0;

if ($id <= 0 || empty($legenda) || empty($unidade)) {
    responderJSON(false, "Dados insuficientes para a atualização.");
}

$stmt = $conn->prepare("UPDATE galeria SET legenda = ?, unidade = ?, ordem = ? WHERE id = ?");
$stmt->bind_param("ssii", $legenda, $unidade, $ordem, $id);

if ($stmt->execute()) {
    responderJSON(true, "Alterações salvas com sucesso!");
} else {
    responderJSON(false, "Erro ao atualizar dados no banco.");
}

$stmt->close();
$conn->close();
?>
