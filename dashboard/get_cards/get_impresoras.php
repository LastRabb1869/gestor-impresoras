<?php
include('../../config/conexion.php');

$sql_impresoras = "SELECT i.id, i.nombre, i.marca, i.num_serie, i.estado, i.imagen, u.nombre AS ubicacion
                   FROM impresoras i
                   JOIN ubicaciones u ON i.ubicacion_id = u.id";
$result_impresoras = mysqli_query($conn, $sql_impresoras);

$impresoras = [];

while ($row = mysqli_fetch_assoc($result_impresoras)) {
    $impresoras[] = $row;
}

header('Content-Type: application/json');
echo json_encode($impresoras);