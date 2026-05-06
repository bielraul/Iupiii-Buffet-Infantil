<?php
/**
 * API: Excluir depoimento
 * Remove registro do banco e foto física se existir
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

$dados = json_decode(file_get_contents("php://input"), true);
$id = isset($dados['id']) ? (int)$dados['id'] : 0;

if ($id <= 0) {
    responderJSON(false, "ID inválido.");
}

// 1. Buscar se tem foto
$stmtBusca = $conn->prepare("SELECT foto FROM depoimentos WHERE id = ?");
$stmtBusca->bind_param("i", $id);
$stmtBusca->execute();
$resultado = $stmtBusca->get_result();
$dep = $resultado->fetch_assoc();

if (!$dep) {
    responderJSON(false, "Depoimento não encontrado.");
}

// 2. Deletar do Banco
$stmtDel = $conn->prepare("DELETE FROM depoimentos WHERE id = ?");
$stmtDel->bind_param("i", $id);

if ($stmtDel->execute()) {
    // 3. Deletar foto física se houver
    if ($dep['foto']) {
        $caminhoFoto = "../../uploads/depoimentos/" . $dep['foto'];
        if (file_exists($caminhoFoto)) {
            unlink($caminhoFoto);
        }
    }
    responderJSON(true, "Depoimento excluído com sucesso!");
} else {
    responderJSON(false, "Erro ao excluir registro do banco.");
}

$stmtBusca->close();
$stmtDel->close();
$conn->close();
?>
