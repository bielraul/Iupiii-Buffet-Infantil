<?php
/**
 * API: Logout de Administrador
 */

require_once "../../config/conexao.php";

configurarCabecalhos();
session_start();

// Destruir todas as variáveis de sessão
$_SESSION = array();

// Se desejar matar a sessão, apague também o cookie da sessão.
// Nota: Isso destruirá a sessão e não apenas os dados da sessão!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destrói a sessão.
session_destroy();

responderJSON(true, "Sessão encerrada com sucesso.");
?>
