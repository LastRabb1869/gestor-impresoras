<?php
// dashboard/get_cards/get_usuarios.php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once "../../config/conexion.php";

$idAct = intval($_SESSION['id']);

// Traemos todos los usuarios excepto el logueado
$sql = "SELECT num_colaborador,
               nombre,
               apellido,
               correo,
               nivel,
               estado,
               imagen_perfil
          FROM usuarios
         WHERE id != ?
         ORDER BY num_colaborador";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $idAct);
$stmt->execute();
$res = $stmt->get_result();
$out = $res->fetch_all(MYSQLI_ASSOC);
echo json_encode($out);