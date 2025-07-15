<!-- panel_admin.php -->
<?php
  session_start();
  if (!isset($_SESSION["loggedin"])||!$_SESSION["loggedin"]) {
    header("Location: ../public/login.php");
    exit;
  }
  
  require_once "../config/conexion.php";

  $nombre = $_SESSION['email'];
  $nivel = $_SESSION['nivel'];

  // — Datos usuario —
  $id_usuario = $_SESSION['id'];
  $sql = "SELECT nombre, apellido, correo, imagen_perfil, num_colaborador
            FROM usuarios WHERE id = ?";
  $stmt = mysqli_prepare($conn, $sql);
  mysqli_stmt_bind_param($stmt, "i", $id_usuario);
  mysqli_stmt_execute($stmt);
  mysqli_stmt_bind_result($stmt,
    $perfil_nombre,
    $perfil_apellido,
    $perfil_correo,
    $perfil_imagen,
    $perfil_numcolab
  );
  mysqli_stmt_fetch($stmt);
  mysqli_stmt_close($stmt);
?>

<!DOCTYPE html>
<html lang="es-ES">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel - <?php echo htmlspecialchars($nivel); ?></title>
  
  <meta name="msapplication-tap-highlight" content="no">

  <link rel="manifest" href="../manifest.json">

  <meta name="mobile-web-app-capable" content="yes">
  <meta name="application-name" content="PWA Starter Kit">
  <link rel="icon" sizes="192x192" href="../icons/web-app-manifest-192x192.png">

  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="PWA Starter Kit">
  <link rel="apple-touch-icon" href="../icons/apple-touch-icon.png">

  <!-- Fuente de iconos Material Symbols -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"/>
  <link rel="stylesheet" href="../assets/css/style_dashboard.css">
</head>
<body>

  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="../icons/favicon.ico" alt="Logo Meliá" class="logo-mini">
      <h2>Printers PPDC</h2>
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
      <li class="nav-item" data-section="componentes-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">memory</span>
          <span>Componentes</span>
        </a>
      </li>
      <li class="nav-item" data-section="departamentos-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">nearby</span>
          <span>Departamentos</span>
        </a>
      </li>
      <h4>
        <span>Gestionar</span>
        <div class="menu-separator"></div>
      </h4>
      <li class="nav-item" data-section="alertas-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">warning</span>
          <span>Incidencias</span>
        </a>
      </li>
      <li class="nav-item" data-section="cambios-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">manage_history</span>
          <span>Cambios</span>
        </a>
      </li>
      <li class="nav-item" data-section="colaboradores-section">
        <a href="javascript:;">
          <span class="material-symbols-outlined">manage_accounts</span>
          <span>Colaboradores</span>
        </a>
      </li>
      <h4>
        <span>Cuenta</span>
        <div class="menu-separator"></div>
      </h4>
      <li class="nav-item" data-section="perfil-section">
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
        <img src="../assets/sources/users/<?= htmlspecialchars($perfil_numcolab) ?>/profile_img/<?= htmlspecialchars($perfil_imagen) ?: 'default-user.png'; ?>" alt="Perfil"/>
        <div class="user-detail">
          <h4><?php echo htmlspecialchars($perfil_nombre); ?></h4>
          <span><?php echo htmlspecialchars($_SESSION['nivel']); ?></span>
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
          <div class="filter-button filter-all" data-filter="todas">
            <span class="filter-all__icon material-symbols-outlined">keyboard_arrow_down</span>
            <span class="filter-all__divider"></span>
            <div class="filter-all__dropdown hidden">
              <!-- JS inyectará aquí los checkboxes de ubicaciones -->
            </div>
            <span class="material-symbols-outlined">view_list</span>
            <span class="filter-all__text">Todas</span>
          </div>
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
      <!-- Sección Departamentos-->
      <section id="departamentos-section" class="dashboard-section">
        <div class="sub-navbar">
          <!-- Barra de navegación con filtros para alertas -->
          <button class="filter-button-dep active" data-filter="todos">
            <span class="material-symbols-outlined">view_list</span>
            <span>Todos</span>
          </button>
          <button class="filter-button-dep" data-filter="site">
            <span class="material-symbols-outlined">check_circle</span>
            <span>Sites</span>
          </button>
          <button class="filter-button-dep" data-filter="bar">
            <span class="material-symbols-outlined">warning</span>
            <span>Bar</span>
          </button>
          <button class="filter-button-dep" data-filter="heladeria">
            <span class="material-symbols-outlined">block</span>
            <span>Heladería</span>
          </button>
          <button class="filter-button-dep" data-filter="lobby">
            <span class="material-symbols-outlined">block</span>
            <span>Lobby</span>
          </button>
          <button class="filter-button-dep" data-filter="oficina">
            <span class="material-symbols-outlined">block</span>
            <span>Oficina</span>
          </button>
        </div>
        <div class="cards-container">
          <!-- Aquí el JS inyectará la sección de departamentos -->
        </div>
      </section>
      <!-- Sección Alertas-->
      <section id="alertas-section" class="dashboard-section">
        <div class="sub-navbar">
          <!-- Barra de navegación con filtros para alertas -->
          <button class="filter-button-alt active" data-filter="todas">
            <span class="material-symbols-outlined">view_list</span>
            <span>Todas</span>
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
      <!-- Sección Colaboradores -->
      <section id="colaboradores-section" class="dashboard-section">
        <div class="sub-navbar">
          <button id="colab-edit-toggle" class="btn-edit">Editar</button>
          <button id="colab-cancel" class="btn-cancel hidden">Cancelar</button>
        </div>
        <div class="table-wrapper">
          <h2>Responsables</h2>
          <table class="table-colab">
            <thead>
              <tr>
                <th>F. Perfil</th>
                <th># Colab.</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>RESPONSIVA</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="table-wrapper">
          <h2>Usuarios</h2>
          <table class="table-users">
            <thead>
              <tr>
                <th>F. Perfil</th>
                <th># Colab.</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Contraseña</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </section>
      <!-- Sección Perfil -->
      <section id="perfil-section" class="dashboard-section">
        <div class="profile-container">
          <h1>Mi Perfil</h1>
          <form id="form-profile" enctype="multipart/form-data">
            <!-- Grupo: foto de perfil -->
            <div class="field-group foto-perfil">
              <label class="avatar-wrapper">
                <img id="preview-photo" src="../assets/sources/users/<?=htmlspecialchars($perfil_numcolab)?>/profile_img/<?=htmlspecialchars($perfil_imagen?:'default-user.png')?>" alt="Foto de perfil">
                <input type="file" id="imagen" name="imagen" accept=".jpg,.png, .jpeg">
              </label>
            </div>
            <div class="field-group">
              <label for="nombre">Nombre</label>
              <input type="text" id="nombre" name="perfil_nombre" class="validable" data-type="perfil_nombre" value="<?=htmlspecialchars($perfil_nombre)?>" required>
            </div>
            <div class="tooltip" id="tooltip-perfil_nombre"></div>
            <div class="field-group">
              <label for="apellido">Apellido</label>
              <input type="text" id="apellido" name="perfil_apellido" class="validable" data-type="perfil_apellido" value="<?=htmlspecialchars($perfil_apellido)?>" required>
            </div>
            <div class="tooltip" id="tooltip-perfil_apellido"></div>
            <div class="field-group">
              <label for="correo">Correo</label>
              <input type="email" id="correo" name="correo" value="<?=htmlspecialchars($perfil_correo)?>" readonly>
            </div>
            <div class="field-group">
              <label for="num_colaborador">Número de Colaborador</label>
              <input type="text" id="num_colaborador" name="num_colaborador" value="<?=htmlspecialchars($perfil_numcolab)?>" readonly>
            </div>
            <div class="field-group">
              <label for="password">Nueva Contraseña</label>
              <input type="password" id="password" name="password" placeholder="Dejar en blanco para no cambiar">
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn-save">Guardar cambios</button>
            </div>
          </form>
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
          <button data-action="departamento" title="Nuevo Departamento">
            <span class="material-symbols-outlined">nearby</span>
          </button>
          <button data-action="alerta" title="Nueva Incidencia">
            <span class="material-symbols-outlined">notification_add</span>
          </button>
          <button data-action="cambio" title="Nuevo Cambio">
            <span class="material-symbols-outlined">loop</span>
          </button>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal para añadir impresora -->
  <div id="modal-impresora" class="modal-overlay hidden">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2>Añadir nueva impresora</h2>
      <form id="form-impresora" enctype="multipart/form-data">
        <div class="form-columns">
          <!-- Imagen -->
          <div class="image-upload">
            <!-- fíjate que el for coincide con el id del input -->
            <label for="imagen_impresora">
              <div class="image-box">
                <div class="placeholder-text">Subir imagen</div>
                <input type="file" name="imagen" id="imagen_impresora" accept=".jpg,.jpeg,.png" required>
                <div class="spinner" style="display:none;"></div>
                <img id="preview-img_impresora" style="display:none; max-height: 150px;" alt="Vista previa del impresora">
              </div>
            </label>
            <span class="status-icon" id="icon-imagen_impresora"></span>
            <small id="nombre-archivo_impresora" class="file-name"></small>
            <small>Formatos: JPG, PNG | Máx: 5MB</small>
          </div>

          <!-- Datos -->
          <div class="fields">
            <div class="field-group">
              <label class="form-lb" for="nombre">Nombre:</label>
              <div class="input-wrapper">
                <input type="text" id="nombre_impresora" name="nombre" placeholder="Nombre" class="validable" data-type="nombre" required>
                <span class="status-icon" id="icon-nombre_impresora" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-nombre_impresora"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="marca">Marca:</label>
              <div class="input-wrapper">
                <input type="text" id="marca_impresora" name="marca" placeholder="Marca" class="validable" data-type="marca" required>
                <span class="status-icon" id="icon-marca_impresora" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-marca_impresora"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="modelo">Modelo:</label>
              <div class="input-wrapper">
                <input type="text" id="modelo" name="modelo" placeholder="Modelo" class="validable" data-type="modelo" required>
                <span class="status-icon" id="icon-modelo" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-modelo"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="num_serie">Número de serie:</label>
              <div class="input-wrapper">
                <input type="text" id="num_serie_impresora" name="num_serie" placeholder="Número de serie" class="validable" data-type="num_serie" required>
                <span class="status-icon" id="icon-num_serie_impresora" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-num_serie_impresora"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="ip">Dirección IP:</label>
              <div class="input-wrapper">
                <input type="text" id="ip" name="ip" placeholder="Dirección IP" class="validable" data-type="ip" required>
                <span class="status-icon" id="icon-ip" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-ip"></div>
            </div>
            
            <div class="field-group">
              <label class="form-lb" for="estado">Estado:</label>
              <div class="input-wrapper">
                <select name="estado" id="estado_impresoras" class="validable" data-type="select" required>
                  <option value="" disabled selected>Selecciona estado</option>
                  <option value="FUNCIONANDO">FUNCIONANDO</option>
                  <option value="CON PROBLEMAS">CON PROBLEMAS</option>
                  <option value="REPARANDO">REPARANDO</option>
                  <option value="BAJA">BAJA</option>
                </select>
                <span class="status-icon" id="icon-estado_impresoras" title=""></span>
              </div>
              <div class="tooltip" id="tooltip-estado_impresoras"></div>
            </div>

            <div class="field-group">
              <label class="form-lb" for="select-ubicacion">Ubicación:</label>
              <div class="input-wrapper">
                <select name="ubicacion" id="select-ubicacion-impresora" class="validable" data-type="select" required>
                  <option value="" disabled selected>Cargando ubicaciones...</option>
                </select>
                <span class="status-icon" id="icon-select-ubicacion-impresora" title=""></span>
              </div>
              <div class="tooltip" id="tooltip-select-ubicacion-impresora"></div>
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

  <!-- Modal Ver/Editar impresora -->
  <div id="modal-ver-impresora" class="modal-overlay hidden">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <!-- Imagen como fondo en el header -->
      <div class="modal-header-image" data-field="imagen"></div>
      <h2>Detalle impresora</h2>
      <section class="contenido">
        <div class="grid">
          <!-- Columna 1 -->
          <div class="fila">
            <label class="form-lb" for="nombre">Nombre:</label>
            <input type="text" data-field="nombre" class="field-input" readonly />
          </div>
          <div class="fila">
            <label>Marca:</label>
            <input type="text" data-field="marca" class="field-input" readonly />
          </div>
          <div class="fila">
            <label>Modelo:</label>
            <input type="text" data-field="modelo" class="field-input" readonly />
          </div>
          <div class="fila">
            <label>Número de serie:</label>
            <input type="text" data-field="num_serie" class="field-input" readonly />
          </div>
          <div class="fila">
            <label>Dirección IP:</label>
            <input type="text" data-field="ip" class="field-input" readonly />
          </div>

          <!-- Columna 2 -->
          <div class="fila">
            <label>Estado:</label>
            <select data-field="estado" class="field-input" disabled>
              <option value="FUNCIONANDO">FUNCIONANDO</option>
              <option value="CON PROBLEMAS">CON PROBLEMAS</option>
              <option value="REPARANDO">REPARANDO</option>
              <option value="BAJA">BAJA</option>
            </select>
          </div>
          <div class="fila">
            <label>Ubicación:</label>
            <select data-field="ubicacion_id" class="field-input" disabled></select>
          </div>
          <div class="fila">
            <label>Responsable:</label>
            <select data-field="responsable_id" class="field-input" disabled></select>
          </div>
          <div class="fila">
            <label>Fecha agregada:</label>
            <input type="text" data-field="fecha_agregada" class="field-input" readonly />
          </div>
          <div class="fila">
            <label>Fecha comprada:</label>
            <input type="date" data-field="fecha_comprada" class="field-input" readonly />
          </div>
        </div>
      </section>
      <footer>
        <button id="btn-editar" class="btn-edit">Editar</button>
        <button id="btn-cancelar" class="btn-cancelar hidden">Cancelar</button>
        <button id="btn-guardar" class="btn-guardar hidden">Guardar</button>
      </footer>
    </div>
  </div>

  <!-- Modal para añadir componente -->
  <div id="modal-componente" class="modal-overlay hidden">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2>Añadir nuevo componente</h2>
      <form id="form-componente" enctype="multipart/form-data">
        <div class="form-columns">
          <!-- Imagen -->
          <div class="image-upload">
            <!-- fíjate que el for coincide con el id del input -->
            <label for="imagen_componente">
              <div class="image-box">
                <div class="placeholder-text">Subir imagen</div>
                <input type="file" name="imagen" id="imagen_componente" accept=".jpg,.jpeg,.png" required>
                <div class="spinner" style="display:none;"></div>
                <img id="preview-img_componente" style="display:none; max-height: 150px;" alt="Vista previa del componente">
              </div>
            </label>
            <span class="status-icon" id="icon-imagen_componente"></span>
            <small id="nombre-archivo_componente" class="file-name"></small>
            <small>Formatos: JPG, PNG | Máx: 5MB</small>
          </div>

          <!-- Datos -->
          <div class="fields">
            <div class="field-group">
              <label class="form-lb" for="nombre">Nombre:</label>
              <div class="input-wrapper">
                <input type="text" id="nombre_componente" name="nombre" placeholder="Nombre" class="validable" data-type="nombre" required>
                <span class="status-icon" id="icon-nombre_componente" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-nombre_componente"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="marca">Marca:</label>
              <div class="input-wrapper">
                <input type="text" id="marca_componente" name="marca" placeholder="Marca" class="validable" data-type="marca" required>
                <span class="status-icon" id="icon-marca_componente" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-marca_componente"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="num_serie">Número de serie:</label>
              <div class="input-wrapper">
                <input type="text" id="num_serie_componente" name="num_serie" placeholder="Número de serie" class="validable" data-type="num_serie" required>
                <span class="status-icon" id="icon-num_serie_componente" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-num_serie_componente"></div>
            </div>
            <div class="field-group">
              <label class="form-lb" for="stock">Cantidad:</label>
              <div class="input-wrapper">
                <input type="text" id="cantidad_stock" name="cantidad_stock" placeholder="Cantidad" class="validable" data-type="cantidad_stock" required>
                <span class="status-icon" id="icon-cantidad_stock" title="">
                </span>
              </div>
              <div class="tooltip" id="tooltip-cantidad_stock"></div>
            </div>

            <div class="field-group">
              <label class="form-lb" for="estado">Estado:</label>
              <div class="input-wrapper">
                <select name="estado" id="estado_componentes" class="validable" data-type="select" required>
                  <option value="" disabled selected>Selecciona estado</option>
                  <option value="EN CONDICIONES">EN CONDICIONES</option>
                  <option value="POSIBLE FALLO">POSIBLE FALLO</option>
                  <option value="SIN STOCK">SIN STOCK</option>
                  <option value="DESCONOCIDO">DESCONOCIDO</option>
                  <option value="BAJA DEFINITIVA">BAJA DEFINITIVA</option>
                </select>
                <span class="status-icon" id="icon-estado_componentes" title=""></span>
              </div>
              <div class="tooltip" id="tooltip-estado_componentes"></div>
            </div>

            <div class="field-group">
              <label class="form-lb" for="select-ubicacion">Ubicación:</label>
              <div class="input-wrapper">
                <select name="ubicacion" id="select-ubicacion-componente" class="validable" data-type="select" required>
                  <option value="" disabled selected>Cargando ubicaciones...</option>
                </select>
                <span class="status-icon" id="icon-select-ubicacion-componente" title=""></span>
              </div>
              <div class="tooltip" id="tooltip-select-ubicacion-componente"></div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn-add">Añadir componente</button>
          <button type="button" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal para añadir Incidencia (Alerta) -->
  <div id="modal-alerta" class="modal-overlay hidden">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2>Nueva Incidencia</h2>
      <form id="form-alerta">
        <div class="fields">
          <!-- Buscador de impresora -->
          <div class="field-group">
            <label for="buscador-impresora">Impresora:</label>
            <div class="input-wrapper">
              <input type="text" id="buscador-impresora" placeholder="Buscar por nombre o S/N" autocomplete="off" class="validable" data-type="select" required />
              <ul id="lista-impresoras" class="suggestions-list"></ul>
            </div>
            <div class="tooltip" id="tooltip-buscador-impresora"></div>
          </div>
          <!-- IP (autocompleto, solo lectura) -->
          <div class="field-group">
            <label for="ip-impresora">Dirección IP:</label>
            <input type="text" id="ip-impresora" readonly data-type="ip" />
          </div>
          <!-- Prioridad -->
          <div class="field-group">
            <label for="prioridad-alerta">Prioridad:</label>
            <div class="input-wrapper">
              <select id="prioridad-alerta" name="prioridad"
                      class="validable" data-type="select" required>
                <option value="" disabled selected>Selecciona prioridad</option>
                <option value="ALTA">ALTA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="BAJA">BAJA</option>
                <option value="FALSA ALARMA">FALSA ALARMA</option>
              </select>
              <span class="status-icon" id="icon-prioridad-alerta"></span>
            </div>
            <div class="tooltip" id="tooltip-prioridad-alerta"></div>
          </div>
          <!-- Reporte -->
          <div class="field-group">
            <label for="reporte-alerta">Reporte:</label>
            <div class="input-wrapper">
              <textarea id="reporte-alerta" name="reporte" rows="4"
                        class="validable" data-type="reporte" required>
              </textarea>
            </div>
            <div class="tooltip" id="tooltip-reporte-alerta"></div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn-add">Crear Incidencia</button>
          <button type="button" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
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
        <img src="../assets/sources/users/<?= htmlspecialchars($perfil_numcolab) ?>/profile_img/<?= htmlspecialchars($perfil_imagen) ?: 'default-user.png'; ?>" class="mobile-avatar" alt="Perfil"/>
        <span>Cuenta</span>
      </li>
    </ul>

    <!-- Sub-menús burbuja -->
    <div class="mobile-submenus">
      <ul class="mobile-nav-sub principal">
        <li data-section="impresoras-section"><span class="material-symbols-outlined">print</span><span>Impresoras</span></li>
        <li data-section="componentes-section"><span class="material-symbols-outlined">memory</span><span>Componentes</span></li>
        <li data-section="departamentos-section"><span class="material-symbols-outlined">nearby</span><span>Departamentos</span></li>
      </ul>
      <ul class="mobile-nav-sub gestionar">
        <li data-section="alertas-section"><span class="material-symbols-outlined">warning</span><span>Incidencias</span></li>
        <li data-section="cambios-section"><span class="material-symbols-outlined">sync_alt</span><span>Cambios</span></li>
        <li data-section="colaboradores-section"><span class="material-symbols-outlined">manage_accounts</span><span>Colaboradores</span></li>
      </ul>
      <ul class="mobile-nav-sub cuenta">
        <li data-section="perfil-section"><span class="material-symbols-outlined">account_circle</span><span>Perfil</span></li>
        <li class="logout-btn"><span class="material-symbols-outlined">logout</span><span>Salir</span></li>
      </ul>
    </div>
  </nav>

  <!-- Modal genérico de mensajes (confirm / success / error) -->
  <div id="modal-mensaje" class="modal-overlay hidden">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2 id="modal-mensaje-titulo"></h2>
      <div id="modal-mensaje-contenido">
        <!-- Aquí se inyecta texto y/o input -->
      </div>
      <div class="msg-actions">
        <button id="modal-mensaje-cancel" class="btn-cancel-msg">Cancelar</button>
        <button id="modal-mensaje-ok" class="btn-ok-msg">Aceptar</button>
      </div>
    </div>
  </div>

  <script type="module" src="../assets/js/dashboard.js"></script>
</body>
</html>