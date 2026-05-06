<?php
/**
 * API: Salvar nova foto na galeria
 * Recebe multipart/form-data, salva arquivo e insere no banco
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderJSON(false, "Método não permitido", null, 405);
}

// Receber dados do formulário
$legenda = isset($_POST['legenda']) ? trim($conn->real_escape_string($_POST['legenda'])) : '';
$unidade = isset($_POST['unidade']) ? trim($conn->real_escape_string($_POST['unidade'])) : '';
$ordem = isset($_POST['ordem']) ? (int)$_POST['ordem'] : 0;

// Validação de campos obrigatórios
if (empty($legenda) || empty($unidade) || !isset($_FILES['imagem'])) {
    responderJSON(false, "Por favor, preencha todos os campos obrigatórios.");
}

// Configuração do Upload
$diretorioUpload = "../../uploads/galeria/";
$limiteTamanho = 5 * 1024 * 1024; // 5MB

// Criar diretório se não existir
if (!is_dir($diretorioUpload)) {
    mkdir($diretorioUpload, 0777, true);
}

// Processar Arquivo
$arquivo = $_FILES['imagem'];

// Validar erros de upload do PHP
if ($arquivo['error'] !== UPLOAD_ERR_OK) {
    responderJSON(false, "Erro no upload do arquivo. Código: " . $arquivo['error']);
}

// Validar tamanho
if ($arquivo['size'] > $limiteTamanho) {
    responderJSON(false, "O arquivo é muito grande. O limite é 5MB.");
}

// Validar tipo MIME real (mais seguro que apenas extensão)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($arquivo['tmp_name']);
$mimesPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

if (!in_array($mimeType, $mimesPermitidos)) {
    responderJSON(false, "Tipo de arquivo inválido. Use JPG, PNG ou WEBP.");
}

// Validar extensão
$extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
$extensoesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($extensao, $extensoesPermitidas)) {
    responderJSON(false, "Extensão de arquivo inválida.");
}

// Gerar nome único para o arquivo
$nomeArquivo = bin2hex(random_bytes(8)) . "_" . time() . "." . $extensao;
$caminhoFinal = $diretorioUpload . $nomeArquivo;

if (move_uploaded_file($arquivo['tmp_name'], $caminhoFinal)) {
    // Inserir no Banco usando Prepared Statement
    $stmt = $conn->prepare("INSERT INTO galeria (imagem, legenda, unidade, ordem) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $nomeArquivo, $legenda, $unidade, $ordem);
    
    if ($stmt->execute()) {
        responderJSON(true, "Foto cadastrada com sucesso!", ["id" => $conn->insert_id]);
    } else {
        // Se falhar no banco, remove o arquivo salvo
        if (file_exists($caminhoFinal)) unlink($caminhoFinal);
        responderJSON(false, "Erro ao salvar no banco de dados.");
    }
    
    $stmt->close();
} else {
    responderJSON(false, "Falha ao mover arquivo para o servidor.");
}

$conn->close();
?>
