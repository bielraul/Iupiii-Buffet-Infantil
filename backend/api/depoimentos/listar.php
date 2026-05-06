<?php
/**
 * API: Listar depoimentos
 * Retorna todos os depoimentos cadastrados no banco
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

$sql = "SELECT * FROM depoimentos ORDER BY ordem ASC, data_criacao DESC";
$resultado = $conn->query($sql);

$depoimentos = [];

if ($resultado && $resultado->num_rows > 0) {
    while($row = $resultado->fetch_assoc()) {
        $depoimentos[] = [
            "id" => $row["id"],
            "nome" => $row["nome"],
            "texto" => $row["texto"],
            "nota" => (int)$row["nota"],
            "foto" => $row["foto"],
            "ordem" => (int)$row["ordem"],
            "data_criacao" => $row["data_criacao"]
        ];
    }
}

responderJSON(true, "Depoimentos listados com sucesso", $depoimentos);

$conn->close();
?>
