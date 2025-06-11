<?php
$host = "localhost";
$db = "gestor_impresoras";
$user = "root";
$pass = ""; // ajustar a futuro si hay contraseña

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>