<?php
include('../../config/conexion.php');

$query = "SELECT * FROM alertas";
$result = mysqli_query($conn, $query);

$alertas = [];

while ($row = mysqli_fetch_assoc($result)) {
    $alertas[] = $row;
}

header('Content-Type: application/json');
echo json_encode($alertas);
?>