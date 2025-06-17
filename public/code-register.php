<?php
    require_once "../config/conexion.php";

    // Inicializar variables
    $nombre = $apellido = $correo = $num_colaborador = $contrasena = $nivel = "";
    $admin_pass = "";
    $nombre_err = $apellido_err = $correo_err = $num_colaborador_err = $contrasena_err = $nivel_err = $admin_pass_err = "";

    // Contraseña secreta para validar acceso de Admin IT
    $clave_admin_real = "123456"; // Obviamente, en un entorno real, esta clave debería ser más segura y almacenada de forma segura.
    // $clave_admin_real = password_hash($clave_admin_real, PASSWORD_DEFAULT);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Validar nombre
        if (empty(trim($_POST["username"]))) {
            $nombre_err = "Por favor, ingresa tu nombre";
        } elseif (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u", trim($_POST["username"]))) {
            $nombre_err = "El nombre solo debe contener letras, espacios y acentos";
        } else {
            $nombre = trim($_POST["username"]);
        }

        // Validar apellido
        if (empty(trim($_POST["lastname"]))) {
            $apellido_err = "Por favor, ingresa tu apellido";
        } elseif (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u", trim($_POST["lastname"]))) {
            $apellido_err = "El apellido solo debe contener letras, espacios y acentos";
        } else {
            $apellido = trim($_POST["lastname"]);
        }

        // Validar correo
        if (empty(trim($_POST["email"]))) {
            $correo_err = "Por favor, ingresa tu correo";
        } elseif (!preg_match("/^[\w\-\.]+@melia\.com$/", trim($_POST["email"]))) {
            $correo_err = "El correo debe terminar en @melia.com";
        } else {
            $sql = "SELECT id FROM USUARIOS WHERE correo = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $correo_temp);
            $correo_temp = trim($_POST["email"]);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $correo_err = "Este correo ya está en uso";
            } else {
                $correo = $correo_temp;
            }
        }

        // Validar número de colaborador
        if (empty(trim($_POST["num_colaborador"]))) {
            $num_colaborador_err = "Por favor, ingresa tu número de colaborador";
        } elseif (!preg_match("/^\d{4}$/", trim($_POST["num_colaborador"]))) {
            $num_colaborador_err = "El número debe tener exactamente 4 dígitos";
        } else {
            $sql = "SELECT id FROM USUARIOS WHERE num_colaborador = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $colab_temp);
            $colab_temp = trim($_POST["num_colaborador"]);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $num_colaborador_err = "Este número de colaborador ya está registrado";
            } else {
                $num_colaborador = $colab_temp;
            }
        }

        // Validar contraseña
        if (empty(trim($_POST["password"]))) {
            $contrasena_err = "Por favor, ingresa una contraseña";
        } elseif (strlen(trim($_POST["password"])) < 6) {
            $contrasena_err = "La contraseña debe tener al menos 6 caracteres";
        } else {
            $contrasena = password_hash(trim($_POST["password"]), PASSWORD_DEFAULT);
        }

        // Validar nivel de autoridad
        if (empty($_POST["nivel"])) {
            $nivel_err = "Selecciona tu nivel de acceso";
        } else {
            $nivel = $_POST["nivel"];
            if ($nivel === "Admin IT") {
                if (empty($_POST["admin_pass"])) {
                    $admin_pass_err = "Debes ingresar la clave de administrador";
                } elseif ($_POST["admin_pass"] !== $clave_admin_real) {
                    $admin_pass_err = "La clave de administrador es incorrecta.";
                }
            }
        }

        // Y si no hay errores, se insertará en la base de datos
        if (empty($nombre_err) && empty($apellido_err) && empty($correo_err) && empty($num_colaborador_err) && empty($contrasena_err) && empty($nivel_err) && empty($admin_pass_err)) {
            $sql = "INSERT INTO USUARIOS (nombre, apellido, correo, num_colaborador, contrasena, nivel) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssss", $nombre, $apellido, $correo, $num_colaborador, $contrasena, $nivel);

            if ($stmt->execute()) {
                header("Location: login.php");
                exit;
            } else {
                echo "Error al registrar. Intenta más tarde.";
            }
        }
    }
?>