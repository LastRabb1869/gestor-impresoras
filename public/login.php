<?php
session_start();
if (isset($_SESSION['nivel'])) {
    header("Location: ../dashboard/panel_" . strtolower($_SESSION['nivel']) . ".php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login - Gestor de Impresoras</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <form action="login.php" method="POST">
        <h2>Iniciar sesión</h2>
        <input type="text" name="colaborador" placeholder="Número de colaborador" required>
        <input type="password" name="password" placeholder="Contraseña" required>
        <button type="submit" name="login">Ingresar</button>
        <a href="register.php">Registrarse</a>
    </form>

    <?php
    if (isset($_POST['login'])) {
        require_once '../config/conexion.php';

        $colaborador = $_POST['colaborador'];
        $password = $_POST['password'];

        $query = $pdo->prepare("SELECT * FROM usuarios WHERE numero_colaborador = ?");
        $query->execute([$colaborador]);

        if ($query->rowCount() == 1) {
            $usuario = $query->fetch();
            if (password_verify($password, $usuario['password'])) {
                $_SESSION['usuario'] = $usuario['nombre'];
                $_SESSION['nivel'] = $usuario['nivel_autoridad'];
                $_SESSION['foto'] = $usuario['foto'] ?? '';
                header("Location: ../dashboard/panel_" . strtolower($usuario['nivel_autoridad']) . ".php");
                exit;
            } else {
                echo "<p style='color:red;'>Contraseña incorrecta</p>";
            }
        } else {
            echo "<p style='color:red;'>Colaborador no encontrado</p>";
        }
    }
    ?>
</body>
</html>
