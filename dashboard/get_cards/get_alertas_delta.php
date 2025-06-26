<?php
// dashboard/get_cards/get_alertas_delta.php
include '../../config/conexion.php';

$desde = $_GET['desde'] ?? null;   // ISO 8601: 2025-06-25 20:17:00
$where = $desde ? "WHERE a.fecha_reportado > ?" : "";

$sql = " SELECT a.id,
         a.impresora_id,
         i.nombre       AS impresora,
         i.num_serie    AS num_serie,
         i.direccion_ip AS direccion_ip,
         u.nombre       AS ubicacion,
         a.prioridad,
         a.reporte,
         a.estado_actual,
         a.fecha_reportado,
         a.fecha_concluido
  FROM   alertas a
  JOIN   impresoras  i ON a.impresora_id = i.id
  LEFT JOIN ubicaciones u ON i.ubicacion_id = u.id
  $where
  ORDER BY a.fecha_reportado DESC";

$stmt = $conn->prepare($sql);
if ($desde){
 $stmt->bind_param('s', $desde);
}
$stmt->execute();
$res = $stmt->get_result();

$alertas = $res->fetch_all(MYSQLI_ASSOC);
header('Content-Type: application/json');
echo json_encode($alertas);