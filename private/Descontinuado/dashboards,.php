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

// Consulta para obtener datos del usuario, incluida imagen y nombre completo
$sql_usuario = "SELECT nombre, imagen_perfil FROM usuarios WHERE id = ?";
$stmt_usuario = mysqli_prepare($conn, $sql_usuario);
mysqli_stmt_bind_param($stmt_usuario, "i", $id_usuario);
mysqli_stmt_execute($stmt_usuario);
mysqli_stmt_bind_result($stmt_usuario, $nombre_usuario, $imagen_perfil);
mysqli_stmt_fetch($stmt_usuario);
mysqli_stmt_close($stmt_usuario);

// Consulta de impresoras
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
  <title>Panel <?php echo htmlspecialchars($nivel); ?></title>
  <link rel="stylesheet" href="../assets/css/style-dashboard.css">
</head>
<body>

    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="../assets/img/paradisus-logo.png" alt="Logo" class="logo-mini">
            <h2 class="sidebar-title">Gestor Meliá</h2>
        </div>
        <ul class="nav-list">
            <li class="nav-item active" data-section="impresoras-section">
            <i class="icon-printer"></i>
            <span>Impresoras</span>
            </li>
            <li class="nav-item" data-section="componentes-section">
            <i class="icon-component"></i>
            <span>Componentes</span>
            </li>
            <li class="nav-item" data-section="alertas-section">
            <i class="icon-alert"></i>
            <span>Alertas y Cambios</span>
            </li>
        </ul>
        <ul class="nav-list bottom">
            <li class="nav-item" id="logout-btn">
            <i class="icon-logout"></i>
            <span>Cerrar sesión</span>
            </li>
        </ul>
    </aside>

  <div class="main-content">
    <header class="topbar">
      <div class="search-container">
        <input type="text" placeholder="Buscar por nombre o serie..." id="searchBar">
      </div>
      <div class="profile-container">
        <img src="../assets/img/<?php echo $imagen_perfil ?: 'default-user.png'; ?>" alt="Perfil" class="avatar" id="profile-avatar">
        <div class="profile-dropdown" id="profile-dropdown" style="display:none;">
          <a href="../public/modify_profile.php">Modificar Perfil</a>
        </div>
      </div>
    </header>

    <main id="content-area">
      <section id="impresoras-section" class="dashboard-section active">
        <div class="sub-navbar">
          <button class="filter-button active" data-filter="operativas">Operativas</button>
          <button class="filter-button" data-filter="no-operativas">Ya no operan</button>
        </div>
        <div class="cards-container">
          <?php foreach($impresoras as $impresora): ?>
            <div class="card impresora-card <?php echo strtolower(str_replace(' ', '-', $impresora['estado'])); ?>" data-estado="<?php echo $impresora['estado']; ?>">
              <div class="card-img">
                <img src="../assets/img/<?php echo $impresora['imagen'] ?: 'default-printer.jpg'; ?>" alt="Imagen impresora">
              </div>
              <div class="card-info">
                <h3><?php echo $impresora['nombre']; ?></h3>
                <p><strong>Serie:</strong> <?php echo $impresora['num_serie']; ?></p>
                <p><strong>Ubicación:</strong> <?php echo $impresora['ubicacion']; ?></p>
                <p><strong>Estado:</strong> <span class="estado-label"><?php echo $impresora['estado']; ?></span></p>
                <button class="expand-button" data-id="<?php echo $impresora['id']; ?>">Ver más</button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </section>

      <section id="componentes-section" class="dashboard-section" style="display:none;">
        <!-- Sección componentes irá aquí -->
      </section>

      <section id="alertas-section" class="dashboard-section" style="display:none;">
        <!-- Sección alertas y cambios irá aquí -->
      </section>
    </main>
  </div>

  <script src="../assets/js/dashboard.js"></script>
</body>
</html>