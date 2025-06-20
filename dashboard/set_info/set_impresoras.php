<?php
// set_impresoras.php
require_once "../../config/conexion.php";

// Función para validar dirección IP
function validarIP($ip) {
    return filter_var($ip, FILTER_VALIDATE_IP);
}

// Verificamos que los datos básicos estén presentes
if (
    isset($_POST['nombre'], $_POST['marca'], $_POST['modelo'], $_POST['num_serie'],
          $_POST['direccion_ip'], $_POST['estado'], $_POST['ubicacion']) &&
    isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK
) {
    $nombre       = trim($_POST['nombre']);
    $marca        = trim($_POST['marca']);
    $modelo       = trim($_POST['modelo']);
    $num_serie    = trim($_POST['num_serie']);
    $direccion_ip = trim($_POST['direccion_ip']);
    $estado       = $_POST['estado'];
    $ubicacion_id = intval($_POST['ubicacion']);

    // Validaciones principales
    if (!preg_match('/^[a-zA-Z0-9 ._\-\(\)\[\]]+$/', $nombre)) {
        die("Error: El nombre contiene caracteres inválidos.");
    }
    if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/', $marca)) {
        die("Error: La marca contiene caracteres inválidos.");
    }
    if (!validarIP($direccion_ip)) {
        die("Error: Dirección IP inválida.");
    }
    if (strpos($num_serie, '/') !== false) {
        die("Error: El número de serie no debe contener diagonales.");
    }

    // Verificar si el número de serie ya existe
    $check = $conn->prepare("SELECT id FROM impresoras WHERE num_serie = ?");
    $check->bind_param("s", $num_serie);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        die("Error: Ya existe una impresora con ese número de serie.");
    }
    $check->close();

    // Validar imagen
    $imagen = $_FILES['imagen'];
    $nombre_archivo = basename($imagen['name']);
    $extension = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));

    if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
        die("Error: Solo se permiten imágenes JPG o PNG.");
    }
    if ($imagen['size'] > 5 * 1024 * 1024) { // 5MB
        die("Error: La imagen supera los 5MB.");
    }

    // Crear carpeta personalizada
    $carpeta_destino = realpath(__DIR__ . '/../../assets/img/printers') . '/' . $num_serie;
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
    $stmt = $conn->prepare("INSERT INTO impresoras 
        (nombre, marca, modelo, num_serie, direccion_ip, estado, ubicacion_id, imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssis", $nombre, $marca, $modelo, $num_serie, $direccion_ip, $estado, $ubicacion_id, $nombre_unico);

    if ($stmt->execute()) {
        echo "OK";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();

} else {
    echo "Error: Datos incompletos o imagen faltante.";
}