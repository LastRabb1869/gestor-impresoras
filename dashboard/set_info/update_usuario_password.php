<?php

// dashboard/set_info/update_usuario_password.php

session_start();
header('Content-Type: application/json');
if (empty($_SESSION['loggedin'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'message'=>'No autorizado']);
  exit;
}
require_once __DIR__ . "/../../config/conexion.php";

$numCol = intval($_POST['num_colaborador'] ?? 0);
$password = trim($_POST['password'] ?? '');

if (!$numCol || strlen($password) < 6) {
  echo json_encode(['success'=>false,'message'=>'Datos inválidos']);
  exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE usuarios SET contrasena = ? WHERE num_colaborador = ?");
$stmt->bind_param('si', $hash, $numCol);
if ($stmt->execute()) {
  echo json_encode(['success'=>true]);
} else {
  echo json_encode(['success'=>false,'message'=>'Error al guardar']);
}