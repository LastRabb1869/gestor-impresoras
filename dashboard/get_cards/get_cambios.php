<?php
include('../../config/conexion.php');

$sql = " SELECT c.id, c.impresora_id, i.nombre AS impresora, i.num_serie AS num_serie, c.componente_id, comp.nombre AS componente, c.descripcion, c.fecha_hora
    FROM cambios c
    JOIN impresoras i   ON c.impresora_id   = i.id
    JOIN componentes comp ON c.componente_id = comp.id
    ORDER BY c.fecha_hora DESC";

$result = mysqli_query($conn, $sql);

$cambios = [];

while ($row = mysqli_fetch_assoc($result)) {
    $cambios[] = $row;
}

header('Content-Type: application/json');
echo json_encode($cambios);