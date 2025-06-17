<!-- panel_admin.php -->
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
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel - <?php echo htmlspecialchars($nivel); ?></title>
  <!-- Fuente de iconos Material Symbols -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"/>
  <link rel="stylesheet" href="../assets/css/style_dashboard.css">
</head>
<body>

  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="../assets/img/ppdc-logo.jpg" alt="Logo Meliá" class="logo-mini">
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
        <span>Gestionar</span>
        <div class="menu-separator"></div>
      </h4>
      <li class="nav-item" id="colaboradores-btn">
        <a href="javascript:;">
          <span class="material-symbols-outlined">manage_accounts</span>
          <span>Colaboradores</span>
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
        <img src="../assets/img/<?php echo $imagen_perfil ?: 'default-user.png'; ?>" alt="FDPerfil" />
        <div class="user-detail">
          <h4><?php echo htmlspecialchars($nombre_usuario); ?></h4>
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
          <!-- Barra de navegación con filtros para impresoras -->
          <button class="filter-button" data-filter="todas">
            <span class="material-symbols-outlined">view_list</span>
            <span>Todas</span>
          </button>
          <button class="filter-button" data-filter="operativas">
            <span class="material-symbols-outlined">check_circle</span>
            <span>Operativas</span>
          </button>
          <button class="filter-button" data-filter="con-problemas">
            <span class="material-symbols-outlined">print_error</span>
            <span>Con problemas</span>
          </button>
          <button class="filter-button" data-filter="reparando">
            <span class="material-symbols-outlined">build_circle</span>
            <span>Reparando</span>
          </button>
          <button class="filter-button" data-filter="no-operativas">
            <span class="material-symbols-outlined">delete</span>
            <span>Baja definitiva</span>
          </button>
        </div>
        <div class="cards-container">
          <!-- Aquí el JS inyectará la sección de impresoras. Por el momento, PHP se encarga en su totalidad -->
        </div>
      </section>
      <!-- Sección Componentes -->
      <section id="componentes-section" class="dashboard-section">
        <div class="sub-navbar">
          <!-- Barra de navegación con filtros para componentes -->
          <button class="filter-button-comp active" data-filter="todos">
            <span class="material-symbols-outlined">view_list</span>
            <span>Todos</span>
          </button>
          <button class="filter-button-comp" data-filter="en-condiciones">
            <span class="material-symbols-outlined">check_circle</span>
            <span>En condiciones</span>
          </button>
          <button class="filter-button-comp" data-filter="posible-fallo">
            <span class="material-symbols-outlined">warning</span>
            <span>Posible fallo</span>
          </button>
          <button class="filter-button-comp" data-filter="sin-stock">
            <span class="material-symbols-outlined">block</span>
            <span>Sin stock</span>
          </button>
          <button class="filter-button-comp" data-filter="desconocido">
            <span class="material-symbols-outlined">help</span>
            <span>Desconocido</span>
          </button>
          <button class="filter-button-comp" data-filter="baja-definitiva">
            <span class="material-symbols-outlined">delete</span>
            <span>Baja definitiva</span>
          </button>
        </div>
        <div class="cards-container">
          <!-- Aquí el JS inyectará la sección de componentes -->
        </div>
      </section>
      <!-- Sección Alertas y Cambios -->
      <section id="alertas-section" class="dashboard-section" style="display:none;">
        <div class="cards-container">
          <!-- Sección por desarrollar... -->
        </div>
      </section>
    </main>
  </div>

  <script src="../assets/js/dashboard.js"></script>
</body>
</html>