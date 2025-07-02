<?php
// assets/php/update_profile.php

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['loggedin'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

require_once "../../config/conexion.php";

$id       = $_SESSION['id'];
$numColab = trim($_POST['num_colaborador']);
$nombre   = trim($_POST['nombre']   ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($nombre === '' || $apellido === '') {
    echo json_encode(['success' => false, 'message' => 'Nombre y apellido obligatorios']);
    exit;
}

/* --- imagen --- */
$imagen_perfil = null;

if (!empty($_FILES['imagen']['name'])) {
    $ext     = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png'];

    if (!in_array($ext, $allowed)) {
        echo json_encode(['success' => false, 'message' => 'Formato de imagen no válido']);
        exit;
    }

    // Ruta absoluta hasta assets/sources/users/{num}/profile_img/
    //$base    = realpath(__DIR__ . '/../..'); // sube de assets/php a assets/
    //$carpeta = $base . "/sources/users/$numColab/profile_img/";
    $carpeta = realpath(__DIR__ . '/../../assets/sources/users') . '/' . $numColab . '/profile_img/';

    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0755, true);
    }

    $nombreNuevo = uniqid('pf_', true) . ".$ext";
    $destino     = $carpeta . $nombreNuevo;

    if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $destino)) {
        echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
        exit;
    }

    $imagen_perfil = $nombreNuevo;
    // Refresca sidebar después
    $_SESSION['imagen_perfil'] = $imagen_perfil;
}

/* --- UPDATE dinámico --- */
$sets   = ['nombre = ?', 'apellido = ?'];
$types  = 'ss';
$params = [$nombre, $apellido];

if ($password !== '') {
    $sets[]   = 'contrasena = ?';
    $types   .= 's';
    $params[] = password_hash($password, PASSWORD_DEFAULT);
}

if ($imagen_perfil) {
    $sets[]   = 'imagen_perfil = ?';
    $types   .= 's';
    $params[] = $imagen_perfil;
}

$types   .= 'i';
$params[] = $id;

$sql   = 'UPDATE usuarios SET ' . implode(', ', $sets) . ' WHERE id = ?';
$stmt  = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Perfil actualizado']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar']);
}
exit;