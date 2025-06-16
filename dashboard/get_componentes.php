<?php
include('../config/conexion.php');

$query = "SELECT * FROM componentes";
$result = mysqli_query($conn, $query);

$componentes = [];

while ($row = mysqli_fetch_assoc($result)) {
    $componentes[] = $row;
}

header('Content-Type: application/json');
echo json_encode($componentes);
?>