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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      <h4>
        <span>Gestionar</span>
        <div class="menu-separator"></div>
      </h4>
      <li class="nav-item" data-section="alertas-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">warning</span>
          <span>Alertas</span>
        </a>
      </li>
      <li class="nav-item" data-section="cambios-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">manage_history</span>
          <span>Cambios</span>
        </a>
      </li>
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
      <li class="nav-item logout-btn">
        <a href="javascript:;">
          <span class="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </a>
      </li>
    </ul>
    <div class="user-account">
      <div class="user-profile">
        <img src="../assets/img/<?php echo $imagen_perfil ?: 'default-user.png'; ?>" alt="Perfil"/>
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
      <!-- Sección Alertas-->
      <section id="alertas-section" class="dashboard-section">
        <div class="sub-navbar">
          <!-- Barra de navegación con filtros para alertas -->
          <button class="filter-button-alt active" data-filter="todas">
            <span class="material-symbols-outlined">view_list</span>
            <span>Todos</span>
          </button>
          <button class="filter-button-alt" data-filter="completado">
            <span class="material-symbols-outlined">check_circle</span>
            <span>Completado</span>
          </button>
          <button class="filter-button-alt" data-filter="en-proceso">
            <span class="material-symbols-outlined">warning</span>
            <span>En proceso</span>
          </button>
          <button class="filter-button-alt" data-filter="sin-arreglo">
            <span class="material-symbols-outlined">block</span>
            <span>Sin arreglo</span>
          </button>
        </div>
        <div class="cards-container">
          <!-- Aquí el JS inyectará la sección de alertas -->
        </div>
      </section>
      <!-- Sección Cambios-->
      <section id="cambios-section" class="dashboard-section">
        <div class="cards-container">
          <!-- Aquí el JS inyectará la sección de alertas -->
        </div>
      </section>
        <!-- FAB de control y añadidos -->
      <div class="fab-menu">
        <button id="fab-toggle" class="fab" title="Acciones rápidas">+</button>
        <div class="fab-options hidden">
          <button data-action="impresora" title="Nueva Impresora">
            <span class="material-symbols-outlined">print</span>
          </button>
          <button data-action="componente" title="Nuevo Componente">
            <span class="material-symbols-outlined">memory</span>
          </button>
          <button data-action="alerta" title="Nueva Alerta">
            <span class="material-symbols-outlined">notification_add</span>
          </button>
          <button data-action="cambio" title="Nuevo Cambio">
            <span class="material-symbols-outlined">loop</span>
          </button>
        </div>
      </div>
    </main>
  </div>

  <!-- Menú inferior para móvil -->
  <nav class="mobile-nav">
    <ul class="mobile-nav-main">
      <li data-group="principal" class="active">
        <span class="material-symbols-outlined">dashboard</span>
        <span>Principal</span>
      </li>
      <li data-group="gestionar">
        <span class="material-symbols-outlined">settings</span>
        <span>Gestionar</span>
      </li>
      <li data-group="cuenta">
        <img src="../assets/img/<?php echo $imagen_perfil ?: 'default-user.png'; ?>" class="mobile-avatar" alt="Perfil"/>
        <span>Cuenta</span>
      </li>
    </ul>

    <!-- Sub-menús burbuja -->
    <div class="mobile-submenus">
      <ul class="mobile-nav-sub principal">
        <li data-section="impresoras-section"><span class="material-symbols-outlined">print</span><span>Impresoras</span></li>
        <li data-section="componentes-section"><span class="material-symbols-outlined">memory</span><span>Componentes</span></li>
      </ul>
      <ul class="mobile-nav-sub gestionar">
        <li data-section="alertas-section"><span class="material-symbols-outlined">warning</span><span>Alertas</span></li>
        <li data-section="cambios-section"><span class="material-symbols-outlined">sync_alt</span><span>Cambios</span></li>
        <li id="colaboradores-btn"><span class="material-symbols-outlined">manage_accounts</span><span>Colaboradores</span></li>
      </ul>
      <ul class="mobile-nav-sub cuenta">
        <li id="profile-open"><span class="material-symbols-outlined">account_circle</span><span>Perfil</span></li>
        <li class="logout-btn"><span class="material-symbols-outlined">logout</span><span>Salir</span></li>
      </ul>
    </div>
  </nav>

  <!-- Modal para añadir impresora -->
  <div id="modal-impresora" class="modal-overlay hidden">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2>Añadir nueva impresora</h2>
      <form id="form-impresora" enctype="multipart/form-data">
        <div class="form-columns">
          <!-- Imagen -->
          <div class="image-upload">
            <label for="imagen">
              <div class="image-box">
                <div class="placeholder-text" id="placeholder-text">Subir imagen</div>
                <input type="file" name="imagen" id="imagen" accept=".jpg,.jpeg,.png" required>
                <div id="uploading" style="display:none;">
                  <div class="spinner"></div>
                  <div class="uploading-text">Subiendo imagen...</div>
                </div>
                <img id="preview-img" style="display:none; max-height: 150px;" alt="Vista previa de la impresora">
              </div>
            </label>
            <span class="status-icon" id="icon-imagen"></span>
            <!-- <div class="tooltip" id="tooltip-imagen">Debes subir una imagen JPG o PNG menor a 5MB.</div> Por ahora -->
            <small id="nombre-archivo" style="display:block; margin-top:0.5rem; color:#555;"></small>
            <small>Formatos: JPG, PNG | Máx: 5MB</small>
          </div>

          <!-- Datos -->
          <div class="fields">
            <div class="field-group">
              <label class="form-lb" for="nombre">Nombre:</label>
              <div class="input-wrapper">
                <input type="text" id="nombre" name="nombre" placeholder="Nombre" class="validable" data-type="nombre" required>
                <span class="status-icon" id="icon-nombre" title="">
                  <!-- SVG se inserta aquí desde JS -->
                </span>
              </div>
              <div class="tooltip" id="tooltip-nombre"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="marca">Marca:</label>
              <div class="input-wrapper">
                <input type="text" id="marca" name="marca" placeholder="Marca" class="validable" data-type="marca" required>
                <span class="status-icon" id="icon-marca" title="">
                  <!-- SVG se inserta aquí desde JS -->
                </span>
              </div>
              <div class="tooltip" id="tooltip-marca"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="modelo">Modelo:</label>
              <div class="input-wrapper">
                <input type="text" id="modelo" name="modelo" placeholder="Modelo" class="validable" data-type="modelo" required>
                <span class="status-icon" id="icon-modelo" title="">
                  <!-- SVG se inserta aquí desde JS -->
                </span>
                <div class="tooltip" id="tooltip-modelo"></div>
              </div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="num_serie">Número de serie:</label>
              <div class="input-wrapper">
                <input type="text" id="num_serie" name="num_serie" placeholder="Número de serie" class="validable" data-type="num_serie" required>
                <span class="status-icon" id="icon-num_serie" title="">
                  <!-- SVG se inserta aquí desde JS -->
                </span>
              </div>
              <div class="tooltip" id="tooltip-num_serie"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="ip">Dirección IP:</label>
              <div class="input-wrapper">
                <input type="text" id="ip" name="ip" placeholder="Dirección IP" class="validable" data-type="ip" required>
                <span class="status-icon" id="icon-ip" title="">
                  <!-- SVG se inserta aquí desde JS -->
                </span>
              </div>
              <div class="tooltip" id="tooltip-ip"></div>
            </div>
            
            <div class="field-group">
              <label class="form-lb" for="estado">Estado:</label>
              <div class="input-wrapper">
                <select name="estado" id="estado" class="validable" data-type="select" required>
                  <option value="" disabled selected>Selecciona estado</option>
                  <option value="FUNCIONANDO">FUNCIONANDO</option>
                  <option value="CON PROBLEMAS">CON PROBLEMAS</option>
                  <option value="REPARANDO">REPARANDO</option>
                  <option value="BAJA">BAJA</option>
                </select>
                <span class="status-icon" id="icon-estado" title=""></span>
              </div>
              <div class="tooltip" id="tooltip-estado"></div>
            </div>

            <div class="field-group">
              <label class="form-lb" for="select-ubicacion">Ubicación:</label>
              <div class="input-wrapper">
                <select name="ubicacion" id="select-ubicacion" class="validable" data-type="select" required>
                  <option value="" disabled selected>Cargando ubicaciones...</option>
                </select>
                <span class="status-icon" id="icon-select-ubicacion" title=""></span>
              </div>
              <div class="tooltip" id="tooltip-select-ubicacion"></div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn-add">Añadir impresora</button>
          <button type="button" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <script type="module" src="../assets/js/dashboard.js"></script>
</body>
</html>