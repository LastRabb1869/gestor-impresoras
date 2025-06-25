<?php
// dashboard/get_cards/get_alertas.php
include '../../config/conexion.php';

$sql = " SELECT
        a.id,
        a.impresora_id,
        i.nombre        AS impresora,
        i.num_serie     AS num_serie,
        i.direccion_ip  AS direccion_ip,
        u.nombre        AS ubicacion,
        a.prioridad,
        a.reporte,
        a.estado_actual,
        a.fecha_reportado,
        a.fecha_concluido
    FROM alertas a
    JOIN impresoras i ON a.impresora_id = i.id
    LEFT JOIN ubicaciones u ON i.ubicacion_id = u.id
    ORDER BY a.fecha_reportado DESC, a.prioridad
";

$result = mysqli_query($conn, $sql);
$alertas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $alertas[] = $row;
}

header('Content-Type: application/json');
echo json_encode($alertas);
?>
