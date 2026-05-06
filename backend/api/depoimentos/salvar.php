<?php
/**
 * API: Salvar novo depoimento
 * Recebe multipart/form-data, salva foto opcional e insere no banco
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderJSON(false, "Método não permitido", null, 405);
}

// Receber dados do formulário
$nome = isset($_POST['nome']) ? trim($conn->real_escape_string($_POST['nome'])) : '';
$texto = isset($_POST['texto']) ? trim($conn->real_escape_string($_POST['texto'])) : '';
$nota = isset($_POST['nota']) ? (int)$_POST['nota'] : 0;
$ordem = isset($_POST['ordem']) ? (int)$_POST['ordem'] : 0;

// Validação de campos obrigatórios
if (empty($nome) || empty($texto) || $nota < 1 || $nota > 5) {
    responderJSON(false, "Por favor, preencha todos os campos obrigatórios corretamente (Nota de 1 a 5).");
}

$nomeFoto = null;

// Processar Foto Opcional
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $diretorioUpload = "../../uploads/depoimentos/";
    $limiteTamanho = 5 * 1024 * 1024; // 5MB

    if (!is_dir($diretorioUpload)) {
        mkdir($diretorioUpload, 0777, true);
    }

    $arquivo = $_FILES['foto'];

    // Validar tamanho
    if ($arquivo['size'] > $limiteTamanho) {
        responderJSON(false, "A foto é muito grande. O limite é 5MB.");
    }

    // Validar tipo MIME
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($arquivo['tmp_name']);
    $mimesPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!in_array($mimeType, $mimesPermitidos)) {
        responderJSON(false, "Tipo de foto inválido. Use JPG, PNG ou WEBP.");
    }

    // Gerar nome único
    $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
    $nomeFoto = bin2hex(random_bytes(8)) . "_" . time() . "." . $extensao;
    $caminhoFinal = $diretorioUpload . $nomeFoto;

    if (!move_uploaded_file($arquivo['tmp_name'], $caminhoFinal)) {
        responderJSON(false, "Falha ao salvar a foto no servidor.");
    }
}

// Inserir no Banco
$stmt = $conn->prepare("INSERT INTO depoimentos (nome, texto, nota, foto, ordem) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssisi", $nome, $texto, $nota, $nomeFoto, $ordem);

if ($stmt->execute()) {
    responderJSON(true, "Depoimento cadastrado com sucesso!", ["id" => $conn->insert_id]);
} else {
    // Se falhar no banco e salvou foto, remove a foto
    if ($nomeFoto && file_exists("../../uploads/depoimentos/" . $nomeFoto)) {
        unlink("../../uploads/depoimentos/" . $nomeFoto);
    }
    responderJSON(false, "Erro ao salvar o depoimento no banco de dados.");
}

$stmt->close();
$conn->close();
?>
