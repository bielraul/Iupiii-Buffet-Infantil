<?php
/**
 * API: Excluir foto da galeria
 * Remove registro do banco e arquivo físico do servidor
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

// Obter ID via JSON ou parâmetro de URL
$dados = json_decode(file_get_contents("php://input"), true);
$id = isset($dados['id']) ? (int)$dados['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);

if ($id <= 0) {
    responderJSON(false, "ID da foto inválido.");
}

// 1. Buscar o nome da imagem antes de deletar do banco
$stmtBusca = $conn->prepare("SELECT imagem FROM galeria WHERE id = ?");
$stmtBusca->bind_param("i", $id);
$stmtBusca->execute();
$resultado = $stmtBusca->get_result();
$foto = $resultado->fetch_assoc();

if (!$foto) {
    responderJSON(false, "A foto não foi encontrada no banco de dados.");
}

$nomeImagem = $foto['imagem'];
$caminhoArquivo = "../../uploads/galeria/" . $nomeImagem;

// 2. Deletar do Banco
$stmtDel = $conn->prepare("DELETE FROM galeria WHERE id = ?");
$stmtDel->bind_param("i", $id);

if ($stmtDel->execute()) {
    // 3. Deletar arquivo físico se existir
    if (file_exists($caminhoArquivo)) {
        if (!unlink($caminhoArquivo)) {
            // Se falhar ao excluir o arquivo físico, avisamos mas o registro já sumiu
            responderJSON(true, "Registro removido, mas houve um problema ao excluir o arquivo físico.");
        }
    }
    
    responderJSON(true, "Foto excluída com sucesso!");
} else {
    responderJSON(false, "Erro ao excluir o registro do banco de dados.");
}

$stmtBusca->close();
$stmtDel->close();
$conn->close();
?>
