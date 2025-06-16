<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("Location: ../public/login.php");
    exit;
}

require_once "../config/conexion.php";

$nombre = $_SESSION['email'];
$nivel = $_SESSION['nivel'];
$id_usuario = $_SESSION['id'];
// Datos de usuario
$sql_usuario = "SELECT nombre, imagen_perfil FROM usuarios WHERE id = ?";
$stmt_usuario = mysqli_prepare($conn, $sql_usuario);
mysqli_stmt_bind_param($stmt_usuario, "i", $id_usuario);
mysqli_stmt_execute($stmt_usuario);
mysqli_stmt_bind_result($stmt_usuario, $nombre_usuario, $imagen_perfil);
mysqli_stmt_fetch($stmt_usuario);
mysqli_stmt_close($stmt_usuario);

// Datos de impresoras
$sql_impresoras = "SELECT i.id, i.nombre, i.num_serie, i.estado, i.imagen, u.nombre AS ubicacion 
                   FROM impresoras i
                   JOIN ubicaciones u ON i.ubicacion_id = u.id";
$result_impresoras = mysqli_query($conn, $sql_impresoras);

$impresoras = [];
while ($row = mysqli_fetch_assoc($result_impresoras)) {
    $impresoras[] = $row;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel - <?php echo htmlspecialchars($nivel); ?></title>
  <!-- Fuente de iconos Material Symbols -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  />
  <link rel="stylesheet" href="../assets/css/style-dashboard.css">
</head>
<body>

  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="../assets/img/logo-mini.png" alt="Logo Meliá" class="logo-mini">
      <h2>Gestor Meliá</h2>
    </div>
    <ul class="sidebar-links">
      <h4>
        <span>Principal</span>
        <div class="menu-separator"></div>
      </h4>
      <li class="nav-item active" data-section="impresoras-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">print</span>
          <span>Impresoras</span>
        </a>
      </li>
      <li id="btnComponentes" class="nav-item" data-section="componentes-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">memory</span>
          <span>Componentes</span>
        </a>
      </li>
      <li class="nav-item" data-section="alertas-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">warning</span>
          <span>Alertas y Cambios</span>
        </a>
      </li>

      <h4>
        <span>Cuenta</span>
        <div class="menu-separator"></div>
      </h4>
      <li class="nav-item" id="profile-open">
        <a href="javascript:;">
          <span class="material-symbols-outlined">account_circle</span>
          <span>Perfil</span>
        </a>
      </li>
      <li class="nav-item" id="logout-btn">
        <a href="javascript:;">
          <span class="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </a>
      </li>
    </ul>
    <div class="user-account">
      <div class="user-profile">
        <img src="../assets/img/<?php echo $imagen_perfil ?: 'default-user.png'; ?>" alt="Foto de perfil de <?php echo $nombre_usuario; ?>" />
        <div class="user-detail">
          <h3><?php echo htmlspecialchars($nombre_usuario); ?></h3>
          <span><?php echo $_SESSION['nivel']; ?></span>
        </div>
      </div>
    </div>
  </aside>

  <div class="main-content">
    <header class="topbar">
      <div class="search-container">
        <input type="text" placeholder="Buscar impresora..." id="searchBar">
      </div>
    </header>

    <main id="content-area">
      <!-- Sección Impresoras -->
      <section id="impresoras-section" class="dashboard-section">
        <div class="sub-navbar">
          <button class="filter-button active" data-filter="operativas">Operativas</button>
          <button class="filter-button" data-filter="no-operativas">Ya no operan</button>
        </div>
        <div class="cards-container">
          <?php foreach($impresoras as $imp): ?>
            <div class="card impresora-card <?php echo strtolower(str_replace(' ', '-', $imp['estado'])); ?>" data-estado="<?php echo $imp['estado']; ?>">
              <div class="card-img">
                <img src="../assets/img/<?php echo $imp['imagen'] ?: 'default-printer.jpg'; ?>" alt="">
              </div>
              <div class="card-info">
                <h3><?php echo htmlspecialchars($imp['nombre']); ?></h3>
                <p><strong>Serie:</strong> <?php echo htmlspecialchars($imp['num_serie']); ?></p>
                <p><strong>Ubicación:</strong> <?php echo htmlspecialchars($imp['ubicacion']); ?></p>
                <p><strong>Estado:</strong> <span class="estado-label"><?php echo $imp['estado']; ?></span></p>
                <button class="expand-button" data-id="<?php echo $imp['id']; ?>">Ver más</button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </section>

      <!-- Sección Componentes -->
      <section id="componentes-section" class="dashboard-section cards-container">
        <!-- Aquí irán las tarjetas de componentes -->
      </section>

      <!-- Sección Alertas y Cambios -->
      <section id="alertas-section" class="dashboard-section" style="display:none;">
        <!-- Aquí irán las alertas y cambios -->
      </section>
    </main>
  </div>

  <script src="../assets/js/dashboard.js"></script>
</body>
</html>
