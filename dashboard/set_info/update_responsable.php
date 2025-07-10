<?php
// dashboard/set_info/update_responsable.php
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

// validación mínima
if (!$numCol || !$nom || !$ape) {
  echo json_encode(['success'=>false,'message'=>'Datos incompletos']); exit;
}

// carpeta destino
$root    = dirname(__DIR__,2);
$baseDir = "$root/assets/sources/users/$numCol/";
if (!is_dir($baseDir)) mkdir($baseDir,0755,true);

// imagen_perfil
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

// archivo PDF
$pdfName = null;
if (!empty($_FILES['archivo']['name'])) {
  $ext = strtolower(pathinfo($_FILES['archivo']['name'],PATHINFO_EXTENSION));
  if ($ext!=='pdf') {
    echo json_encode(['success'=>false,'message'=>'Sólo PDF permitido']); exit;
  }
  $out = "$baseDir/archivo/";
  if (!is_dir($out)) mkdir($out,0755,true);
  $pdfName = uniqid('doc_',true).".pdf";
  if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $out.$pdfName)) {
    echo json_encode(['success'=>false,'message'=>'Error al subir PDF']); exit;
  }
}

// construimos UPDATE dinámico
$sets   = ['nombre=?','apellido=?','estado=?'];
$types  = 'sss';
$params = [$nom,$ape,$estado];

if ($imgName) {
  $sets[]   = 'imagen_perfil=?';
  $types   .= 's';
  $params[] = $imgName;
}
if ($pdfName) {
  $sets[]   = 'archivo=?';
  $types   .= 's';
  $params[] = $pdfName;
}

$types   .= 'i';
$params[] = $numCol;

$sql = "UPDATE responsables SET ".implode(',',$sets)." WHERE num_colaborador=?";
$stmt= $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
if ($stmt->execute()) {
  echo json_encode(['success'=>true,'message'=>'Responsable actualizado']);
} else {
  echo json_encode(['success'=>false,'message'=>'Error en base de datos']);
}