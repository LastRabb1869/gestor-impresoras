<?php
// dashboard/get_cards/get_impresoras.php

include '../../config/conexion.php';

$sql_impresoras = "SELECT
    i.id,
    i.nombre,
    i.marca,
    i.modelo,
    i.num_serie,
    i.direccion_ip,
    i.estado,
    i.ubicacion_id,
    u.nombre       AS ubicacion,
    i.imagen,
    i.fecha_agregada,
    i.fecha_comprada,
    i.responsable_id,
    CONCAT(r.nombre, ' ', r.apellido) AS responsable_nombre
  FROM impresoras i
  LEFT JOIN ubicaciones u ON i.ubicacion_id = u.id
  LEFT JOIN responsables r ON i.responsable_id = r.id
  ORDER BY i.nombre
";
$result_impresoras = mysqli_query($conn, $sql_impresoras);

$impresoras = [];

while ($row = mysqli_fetch_assoc($result_impresoras)) {
    $impresoras[] = $row;
}

header('Content-Type: application/json');
echo json_encode($impresoras);