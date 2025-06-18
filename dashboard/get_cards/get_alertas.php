<?php
include('../../config/conexion.php');

$sql = " SELECT a.id, a.impresora_id, i.nombre AS impresora, a.prioridad, a.direccion_ip, a.reporte, a.estado_actual, a.fecha_hora
        FROM alertas a
        JOIN impresoras i ON a.impresora_id = i.id
        ORDER BY a.fecha_hora DESC";
$result = mysqli_query($conn, $sql);

$alertas = [];

while ($row = mysqli_fetch_assoc($result)) {
    $alertas[] = $row;
}

header('Content-Type: application/json');
echo json_encode($alertas);