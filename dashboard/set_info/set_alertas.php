<?php
// dashboard/set_info/set_alertas.php

include '../../config/conexion.php';
header('Content-Type: application/json; charset=utf-8');

function error($msg, $code = 400) {
  http_response_code($code);
  echo json_encode([ 'success' => false, 'message' => $msg ]);
  exit;
}

$impresora_id = isset($_POST['impresora_id']) ? intval($_POST['impresora_id']) : 0;
$prioridad    = $_POST['prioridad']    ?? '';
$reporte      = trim($_POST['reporte'] ?? '');

if ($impresora_id <= 0 || !in_array($prioridad, ['ALTA','MEDIA','BAJA','FALSA ALARMA']) || $reporte === '') {
  error('Datos invalidos o incompletos.');
}

// Recuperar IP y estado de impresora
$stmt = $conn->prepare("SELECT direccion_ip FROM impresoras WHERE id = ? LIMIT 1");
$stmt->bind_param('i', $impresora_id);
$stmt->execute();
$stmt->bind_result($direccion_ip);
if (!$stmt->fetch()){
    error('Impresora no encontrada.', 404);
}
$stmt->close();

$stmt = $conn->prepare("SELECT COUNT(*) FROM alertas WHERE impresora_id = ? AND estado_actual = 'EN PROCESO'");
$stmt->bind_param('i', $impresora_id);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

if ($cnt > 0){
     error('Ya existe una incidencia activa para esta impresora.', 409);
}

$estado_actual = $prioridad === 'FALSA ALARMA' ? 'COMPLETADO' : 'EN PROCESO';

$stmt = $conn->prepare("INSERT INTO alertas 
    (impresora_id, prioridad, direccion_ip, reporte, estado_actual) 
    VALUES (?,?,?,?,?)");
$stmt->bind_param('issss', $impresora_id, $prioridad, $direccion_ip, $reporte, $estado_actual);

if (!$stmt->execute()){
    error('Error al registrar la incidencia: '.$conn->error, 500);
}
$alerta_id = $stmt->insert_id;
$stmt->close();

// ——> Actualizar estado de impresora según prioridad
if ($prioridad !== 'FALSA ALARMA') {
    $upd = $conn->prepare(
        "UPDATE impresoras
           SET estado = 'CON PROBLEMAS'
           WHERE id = ?"
    );
    $upd->bind_param('i', $impresora_id);
    $upd->execute();
    $upd->close();
}

echo json_encode([ 'success' => true, 'message' => 'Incidencia creada.', 'id' => $alerta_id ]);