<?php
// dashboard/get_cards/get_responsables.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once "../../config/conexion.php";

// Traemos responsables + nombre de ubicación
$sql = "SELECT r.num_colaborador,
               r.nombre,
               r.apellido,
               u.nombre AS ubicacion_nombre,
               r.estado,
               r.imagen_perfil,
               r.archivo
          FROM responsables r
          LEFT JOIN ubicaciones u ON r.ubicacion_id = u.id
         ORDER BY r.num_colaborador";
$res = mysqli_query($conn, $sql);
$out = [];
while ($row = mysqli_fetch_assoc($res)) {
    $out[] = $row;
}
echo json_encode($out);