<?php
// set_componentes.php
require_once "../../config/conexion.php";

// Función para validar dirección IP
function validarIP($ip) {
    return filter_var($ip, FILTER_VALIDATE_IP);
}

// Verificamos que los datos básicos estén presentes
$nombre       = trim($_POST['nombre']);
$marca        = trim($_POST['marca']);
$num_serie    = trim($_POST['num_serie']);
$cantidad_stock = intval($_POST['cantidad_stock']);
$estado       = $_POST['estado'];
$ubicacion_id = intval($_POST['ubicacion']);

// Validaciones principales
if (strpos($num_serie, '/') !== false) {
    die("Error: El número de serie no debe contener diagonales.");
}

// Verificar si el número de serie ya existe
$check = $conn->prepare("SELECT id FROM componentes WHERE num_serie = ?");
$check->bind_param("s", $num_serie);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    die("Error: Ya existe un componente registrado con ese número de serie.");
}
$check->close();

// Validar imagen
$imagen = $_FILES['imagen'];
$nombre_archivo = basename($imagen['name']);
$extension = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));

if ($imagen['size'] > 5 * 1024 * 1024) { // 5MB
    die("Error: La imagen supera los 5MB.");
}

// Crear carpeta personalizada
$carpeta_destino = realpath(__DIR__ . '/../../assets/sources/components') . '/' . $num_serie . '/img';
if (!is_dir($carpeta_destino)) {
    mkdir($carpeta_destino, 0755, true);
}

// Renombrar imagen por seguridad y evitar conflictos
$nombre_unico = uniqid("img_", true) . "." . $extension;
$ruta_final = $carpeta_destino . "/" . $nombre_unico;

// Mover la imagen al destino
if (!move_uploaded_file($imagen['tmp_name'], $ruta_final)) {
    die("Error al guardar la imagen.");
}

// Insertar en la base de datos
$stmt = $conn->prepare("INSERT INTO componentes
    (nombre, marca, num_serie, cantidad_stock, estado, ubicacion_id, imagen)
    VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssis", $nombre, $marca, $num_serie, $cantidad_stock, $estado, $ubicacion_id, $nombre_unico);

if ($stmt->execute()) {
    echo "OK";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();