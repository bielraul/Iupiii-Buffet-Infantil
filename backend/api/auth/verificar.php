<?php
/**
 * API: Verificar se o usuário está autenticado
 */

require_once "../../config/conexao.php";

configurarCabecalhos();
session_start();

if (isset($_SESSION['admin_logado']) && $_SESSION['admin_logado'] === true) {
    responderJSON(true, "Usuário autenticado.", [
        "id" => $_SESSION['admin_id'],
        "nome" => $_SESSION['admin_nome'],
        "email" => $_SESSION['admin_email']
    ]);
} else {
    responderJSON(false, "Usuário não autenticado.");
}
?>
