<?php
// dashboard/set_info/update_usuario.php
session_start();
header('Content-Type: application/json');
if (empty($_SESSION['loggedin'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'message'=>'No autorizado']);
  exit;
}
require_once __DIR__ . "/../../config/conexion.php";

$numCol = intval($_POST['num_colaborador'] ?? 0);
$nom     = trim($_POST['nombre']   ?? '');
$ape     = trim($_POST['apellido'] ?? '');
$estado  = in_array($_POST['estado'],['ALTA','BAJA']) ? $_POST['estado'] : 'ALTA';
$nivel   = in_array($_POST['nivel'],['IT','Admin IT']) ? $_POST['nivel'] : 'IT';

if (!$numCol || !$nom || !$ape) {
  echo json_encode(['success'=>false,'message'=>'Datos incompletos']); exit;
}

$root    = dirname(__DIR__,2);
$baseDir = "$root/assets/sources/users/$numCol/";
if (!is_dir($baseDir)) mkdir($baseDir,0755,true);

$imgName = null;
if (!empty($_FILES['imagen']['name'])) {
  $ext = strtolower(pathinfo($_FILES['imagen']['name'],PATHINFO_EXTENSION));
  if (!in_array($ext,['jpg','jpeg','png'])) {
    echo json_encode(['success'=>false,'message'=>'Formato de imagen no válido']); exit;
  }
  $out = "$baseDir/profile_img/";
  if (!is_dir($out)) mkdir($out,0755,true);
  $imgName = uniqid('pf_',true).".$ext";
  if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $out.$imgName)) {
    echo json_encode(['success'=>false,'message'=>'Error al subir la foto de perfil']); exit;
  }
}

// dinamismo UPDATE
$sets   = ['nombre=?','apellido=?','estado=?','nivel=?'];
$types  = 'ssss';
$params = [$nom,$ape,$estado,$nivel];

if ($imgName) {
  $sets[]   = 'imagen_perfil=?';
  $types   .= 's';
  $params[] = $imgName;
}

$sql = "UPDATE usuarios SET ".implode(',',$sets)." WHERE num_colaborador=?";
$types   .= 'i';
$params[] = $numCol;

$stmt= $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
if ($stmt->execute()) {
  echo json_encode(['success'=>true,'message'=>'Usuario actualizado']);
} else {
  echo json_encode(['success'=>false,'message'=>'Error en base de datos']);
}