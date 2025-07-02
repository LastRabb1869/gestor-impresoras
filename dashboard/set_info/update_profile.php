<?php
// dashboard/set_info/update_profile.php
session_start();
header('Content-Type: application/json');

// 1 — seguridad
if (empty($_SESSION['loggedin'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'message'=>'No autorizado']); exit;
}

// 2 — conexión
require_once dirname(__DIR__,2).'/config/conexion.php';

// 3 — datos
$id       = $_SESSION['id'];
$numColab = $_SESSION['num_colaborador'] ?? '';

$nombre   = trim($_POST['nombre']   ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($nombre==='' || $apellido==='') {
  echo json_encode(['success'=>false,'message'=>'Nombre y apellido obligatorios']); exit;
}

// 4 — captura de Warnings para que nunca salgan en el JSON
ob_start();

// ---------- F O T O ----------
$imagen_perfil = null;
if (!empty($_FILES['imagen']['name'])) {

  $ext = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
  if (!in_array($ext,['jpg','jpeg','png'])) {
    ob_end_clean();
    echo json_encode(['success'=>false,'message'=>'Formato de imagen no válido']); exit;
  }

  // ruta absoluta   .../assets/sources/users/{numColab}/profile_img/
  $root    = dirname(__DIR__,2);                // llega a la raíz del proyecto
  $carpeta = "$root/assets/sources/users/$nombre/profile_img/";

  if (!is_dir($carpeta) && !mkdir($carpeta,0755,true)) {
    ob_end_clean();
    echo json_encode(['success'=>false,'message'=>'No se pudo crear la carpeta del usuario']); exit;
  }

  $nuevoNombre = uniqid('pf_',true).".".$ext;
  if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $carpeta.$nuevoNombre)) {
    ob_end_clean();
    echo json_encode(['success'=>false,'message'=>'Error al copiar la imagen']); exit;
  }

  $imagen_perfil = $nuevoNombre;
}

// 5 — SQL dinámico
$sets   = ['nombre=?','apellido=?'];
$types  = 'ss';
$params = [$nombre,$apellido];

if ($password!=='') {
  $sets[]   = 'contrasena=?';
  $types   .= 's';
  $params[] = password_hash($password,PASSWORD_DEFAULT);
}
if ($imagen_perfil) {
  $sets[]   = 'imagen_perfil=?';
  $types   .= 's';
  $params[] = $imagen_perfil;
}

$sql = "UPDATE usuarios SET ".implode(',',$sets)." WHERE id=?";
$types .= 'i';  $params[] = $id;

$stmt = $conn->prepare($sql);
if (!$stmt) {
  ob_end_clean();
  echo json_encode(['success'=>false,'message'=>'Error interno']); exit;
}
$stmt->bind_param($types, ...$params);

$status = $stmt->execute();
ob_end_clean();

if ($status) {
  if ($imagen_perfil) $_SESSION['imagen_perfil'] = $imagen_perfil;
  echo json_encode(['success'=>true,'message'=>'Perfil actualizado']);
} else {
  echo json_encode(['success'=>false,'message'=>'Error al guardar']);
}
exit;