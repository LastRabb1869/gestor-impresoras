<?php
include '../../config/conexion.php';

$sql_componentes = "SELECT i.id, i.nombre, i.marca, i.num_serie, i.cantidad_stock, i.estado, i.imagen, u.nombre AS ubicacion
                   FROM componentes i
                   JOIN ubicaciones u ON i.ubicacion_id = u.id
                   ORDER BY i.nombre";
$result_componentes = mysqli_query($conn, $sql_componentes);

$componentes = [];

while ($row = mysqli_fetch_assoc($result_componentes)) {
    $componentes[] = $row;
}

header('Content-Type: application/json');
echo json_encode($componentes);