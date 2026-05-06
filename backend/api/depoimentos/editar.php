<?php
/**
 * API: Editar depoimento
 * Atualiza dados e foto opcionalmente
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

// Para upload de arquivo com outros campos, usamos POST multipart/form-data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderJSON(false, "Método não permitido", null, 405);
}

// Receber dados
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$nome = isset($_POST['nome']) ? trim($conn->real_escape_string($_POST['nome'])) : '';
$texto = isset($_POST['texto']) ? trim($conn->real_escape_string($_POST['texto'])) : '';
$nota = isset($_POST['nota']) ? (int)$_POST['nota'] : 0;
$ordem = isset($_POST['ordem']) ? (int)$_POST['ordem'] : 0;

if ($id <= 0 || empty($nome) || empty($texto) || $nota < 1 || $nota > 5) {
    responderJSON(false, "Dados insuficientes ou inválidos para a atualização.");
}

// 1. Buscar dados atuais para saber se tem foto antiga
$stmtBusca = $conn->prepare("SELECT foto FROM depoimentos WHERE id = ?");
$stmtBusca->bind_param("i", $id);
$stmtBusca->execute();
$resultado = $stmtBusca->get_result();
$depoimentoAtual = $resultado->fetch_assoc();

if (!$depoimentoAtual) {
    responderJSON(false, "Depoimento não encontrado.");
}

$nomeFotoNova = $depoimentoAtual['foto'];

// 2. Processar Nova Foto se enviada
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $diretorioUpload = "../../uploads/depoimentos/";
    $limiteTamanho = 5 * 1024 * 1024;

    if (!is_dir($diretorioUpload)) {
        mkdir($diretorioUpload, 0777, true);
    }

    $arquivo = $_FILES['foto'];

    if ($arquivo['size'] <= $limiteTamanho) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($arquivo['tmp_name']);
        $mimesPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

        if (in_array($mimeType, $mimesPermitidos)) {
            $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
            $nomeFotoNova = bin2hex(random_bytes(8)) . "_" . time() . "." . $extensao;
            $caminhoFinal = $diretorioUpload . $nomeFotoNova;

            if (move_uploaded_file($arquivo['tmp_name'], $caminhoFinal)) {
                // Excluir foto antiga se existia
                if ($depoimentoAtual['foto'] && file_exists($diretorioUpload . $depoimentoAtual['foto'])) {
                    unlink($diretorioUpload . $depoimentoAtual['foto']);
                }
            }
        }
    }
}

// 3. Atualizar no Banco
$stmt = $conn->prepare("UPDATE depoimentos SET nome = ?, texto = ?, nota = ?, foto = ?, ordem = ? WHERE id = ?");
$stmt->bind_param("ssisii", $nome, $texto, $nota, $nomeFotoNova, $ordem, $id);

if ($stmt->execute()) {
    responderJSON(true, "Depoimento atualizado com sucesso!");
} else {
    responderJSON(false, "Erro ao atualizar dados no banco.");
}

$stmtBusca->close();
$stmt->close();
$conn->close();
?>
