<?php
// dashboard/get_cards/get_impresoras_disponibles.php

include '../../config/conexion.php';
header('Content-Type: application/json; charset=utf-8');

$sql = "
  SELECT i.id,
         i.nombre  AS impresora,
         i.num_serie,
         i.direccion_ip,
         'DISPONIBLE' AS estado_actual
  FROM   impresoras i
  LEFT JOIN alertas a
         ON a.impresora_id = i.id
        AND a.estado_actual = 'EN PROCESO'
  WHERE  a.id IS NULL
    AND  i.estado NOT IN ('REPARANDO', 'CON PROBLEMAS')
  ORDER BY i.nombre ASC";

$result = mysqli_query($conn, $sql);
$impresoras = [];

if ($result && mysqli_num_rows($result) > 0) {
  while ($row = mysqli_fetch_assoc($result)) {
    $impresoras[] = $row;
  }
}

echo json_encode($impresoras);