<?php
/**
 * Configuração de conexão com o banco de dados MySQL via mysqli
 */

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "iupiii";

// Habilitar exibição de erros para debug (desabilitar em produção)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexão com o banco
$conn = new mysqli($host, $usuario, $senha, $banco);

// Verificar conexão
if ($conn->connect_error) {
    responderJSON(false, "Falha na conexão: " . $conn->connect_error, null, 500);
}

// Definir charset para evitar problemas com acentuação
$conn->set_charset("utf8mb4");

/**
 * Função para configurar cabeçalhos CORS e Content-Type
 */
function configurarCabecalhos() {
    // Para funcionar com sessões e credenciais (cookies), não podemos usar "*"
    $origem = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:3000';
    
    header("Access-Control-Allow-Origin: $origem");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header('Content-Type: application/json; charset=utf-8');
    
    // Configurações de Sessão seguras para o navegador
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax'); // Permite cookies cross-site em navegação top-level

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }
}

/**
 * Helper para responder requisições em formato JSON de forma padronizada
 */
function responderJSON($sucesso, $mensagem, $dados = null, $codigoHttp = 200) {
    http_response_code($codigoHttp);
    echo json_encode([
        "sucesso" => $sucesso,
        "mensagem" => $mensagem,
        "dados" => $dados
    ]);
    exit;
}
?>
