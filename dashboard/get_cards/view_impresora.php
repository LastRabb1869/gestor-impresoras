<?php
// dashboard/get_cards/view_impresora.php
include '../../config/conexion.php';

// Forzamos un entero seguro
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$sql = "SELECT
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
  LEFT JOIN ubicaciones u    ON i.ubicacion_id = u.id
  LEFT JOIN responsables r   ON i.responsable_id = r.id
  WHERE i.id = $id
  LIMIT 1
";
$res = mysqli_query($conn, $sql);
$data = $res && mysqli_num_rows($res) 
      ? mysqli_fetch_assoc($res) 
      : [];

header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);