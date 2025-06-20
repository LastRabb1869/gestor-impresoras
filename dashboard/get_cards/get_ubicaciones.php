<?php
// get_ubicaciones.php
include "../../config/conexion.php";

$sql = "SELECT id, nombre, tipo FROM ubicaciones ORDER BY nombre ASC";
$result = mysqli_query($conn, $sql);

$ubicaciones = [];

if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $ubicaciones[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($ubicaciones);
