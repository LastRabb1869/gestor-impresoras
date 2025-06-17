function cargarimpresoras() {
    fetch('get_cards/get_impresoras.php')
      .then(res => res.json())
      .then(data => {
        const cont = impresorasSection.querySelector('.cards-container');
        cont.innerHTML = '';
        if (!data.length) {
          cont.innerHTML = '<p>No hay impresoras registradas.</p>';
          return;
        }
        data.forEach(c => {
          const card = document.createElement('div');
          card.className = 'card impresora-card';
          card.setAttribute('data-estado', c.estado);
          card.innerHTML = `
            <div class="card-img">
              <img src="../assets/img/${c.imagen || 'default-impresora.jpg'}" alt="${c.nombre}">
            </div>
            <div class="card-info">
              <h3>${c.nombre}</h3>
              <p><strong>Serie:</strong> ${c.num_serie}</p>
              <p><strong>Marca:</strong> ${c.marca}</p>
              <p><strong>Ubicación:</strong> ${c.ubicacion}</p>
              <p><strong>Estado:</strong> ${c.estado}</p>
              <button class="expand-button">Ver</button>
            </div>`;
          cont.appendChild(card);
        });
      })
      .catch(err => console.error('Hubo un error al cargar las impresoras: ', err));
  }


<?php foreach($impresoras as $imp): ?>
            <div class="card impresora-card <?php echo strtolower(str_replace(' ', '-', $imp['estado'])); ?>" data-estado="<?php echo $imp['estado']; ?>">
              <div class="card-img">
                <img src="../assets/img/<?php echo $imp['imagen'] ?: 'default-printer.jpg'; ?>" alt="<?php echo htmlspecialchars($imp['nombre']); ?>">
              </div>
              <div class="card-info">
                <h3><?php echo htmlspecialchars($imp['nombre']); ?></h3>
                <p><strong>Serie:</strong> <?php echo htmlspecialchars($imp['num_serie']); ?></p>
                <p><strong>Ubicación:</strong> <?php echo htmlspecialchars($imp['ubicacion']); ?></p>
                <p><strong>Estado:</strong> <span class="estado-label"><?php echo $imp['estado']; ?></span></p>
                <button class="expand-button" data-id="<?php echo $imp['id']; ?>">Ver</button>
              </div>
            </div>
          <?php endforeach; ?>

// Datos de impresoras
$sql_impresoras = "SELECT i.id, i.nombre, i.num_serie, i.estado, i.imagen, u.nombre AS ubicacion
                   FROM impresoras i
                   JOIN ubicaciones u ON i.ubicacion_id = u.id";
$result_impresoras = mysqli_query($conn, $sql_impresoras);

$impresoras = [];
while ($row = mysqli_fetch_assoc($result_impresoras)) {
    $impresoras[] = $row;
}