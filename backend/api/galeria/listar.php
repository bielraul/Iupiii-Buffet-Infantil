<?php
/**
 * API: Listar fotos da galeria
 * Retorna JSON com os registros ordenados
 */

require_once "../../config/conexao.php";

configurarCabecalhos();

$sql = "SELECT * FROM galeria ORDER BY ordem ASC, data_criacao DESC";
$resultado = $conn->query($sql);

$fotos = [];

if ($resultado && $resultado->num_rows > 0) {
    while($row = $resultado->fetch_assoc()) {
        $fotos[] = [
            "id" => $row["id"],
            "imagem" => $row["imagem"],
            "legenda" => $row["legenda"],
            "unidade" => $row["unidade"],
            "ordem" => (int)$row["ordem"],
            "data_criacao" => $row["data_criacao"]
        ];
    }
}

responderJSON(true, "Fotos listadas com sucesso", $fotos);

$conn->close();
?>
