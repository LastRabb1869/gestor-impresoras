<?php
session_start();

if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true || $_SESSION["nivel"] !== 'Admin IT') {
    header("location: ../public/login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es-Es">
<head>
    <meta charset="UTF-8">
    <title>Bienvenida</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
</head>
<body>
   
   <div class="ctn-welcome">
       
       <img src="../assets/img/ppdc-logo1.png" alt="" class="logo-welcome">
       <h1 class="title-welcome">Bienvenido lo has doblemente clavado chaval! <b>PANEL DEL PUTÍSIMO ADMIN!</b></h1>
       <a href="../public/close-session.php" class="close-sesion">Cerrar Sesión</a>
       
   </div>
   
    
</body>
</html>