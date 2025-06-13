<?php  
    include 'code-register.php'; 

?>

<!DOCTYPE html>
<html lang="es-ES">
    <head>
        <meta charset="UTF-8">
        <title>REGISTRO - PRINT MANAGER</title>
        <link rel="stylesheet" href="../assets/css/style.css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="../assets/img/favicon.ico" type="image/x-icon">
    </head>
    <body>
    <div class="container-all">
        <div class="ctn-form">
            <img src="../assets/img/ppdc-logo1.png" alt="Logo" class="logo">
            <h1 class="title">Registrarse</h1>

            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <label>Nombre completo</label>
                <input type="text" name="username" value="<?php echo $nombre; ?>">
                <span class="msg-error"><?php echo $nombre_err; ?></span>

                <label>Email - Meliá</label>
                <input type="text" name="email" value="<?php echo $correo; ?>">
                <span class="msg-error"><?php echo $correo_err; ?></span>

                <label>Número de colaborador</label>
                <input type="text" name="num_colaborador" maxlength="4" value="<?php echo $num_colaborador; ?>">
                <span class="msg-error"><?php echo $num_colaborador_err; ?></span>

                <label>Contraseña</label>
                <input type="password" name="password">
                <span class="msg-error"><?php echo $contrasena_err; ?></span>

                <label>Nivel de acceso</label>
                <select name="nivel">
                    <option value="">Selecciona</option>
                    <option value="IT" <?php if ($nivel == 'IT') echo 'selected'; ?>>IT</option>
                    <option value="Admin IT" <?php if ($nivel == 'Admin IT') echo 'selected'; ?>>Admin IT</option>
                </select>
                <span class="msg-error"><?php echo $nivel_err; ?></span>

                <div id="clave-admin" style="display: <?php echo ($nivel === 'Admin IT') ? 'block' : 'none'; ?>;">
                    <label>Clave Admin IT</label>
                    <input type="password" name="admin_pass">
                    <span class="msg-error"><?php echo $admin_pass_err; ?></span>
                </div>

                <input type="submit" value="Registrarse">
            </form>

            <span class="text-footer">¿Ya tienes cuenta?
                <a href="login.php">Iniciar Sesión</a>
            </span>
        </div>

        <div class="ctn-text">
            <div class="capa"></div>
            <h1 class="title-description">Gestor de impresoras Meliá</h1>
            <p class="text-description">Sistema para registrar y administrar el inventario de impresoras del hotel.</p>
        </div>
    </div>

    <script>
        const nivelSelect = document.querySelector('select[name="nivel"]');
        const adminInput = document.getElementById('clave-admin');

        nivelSelect.addEventListener('change', function () {
            adminInput.style.display = this.value === 'Admin IT' ? 'block' : 'none';
        });
    </script>
    </body>
</html>
