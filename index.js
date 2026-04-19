// seccion 1 — hangar de naves

// cargar datos de pilotos desde localstorage o crear array vacío si no existe
let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];

// cargar datos de misiones desde localstorage o crear array vacío si no existe
let misiones = JSON.parse(localStorage.getItem("misiones")) || [];

// índice usado para saber si estamos editando un piloto o creando uno nuevo
let editIndex = null;

// estados posibles de las misiones para el kanban
let estados = ["todo", "in_progress", "done"];

// array de naves fijo (datos iniciales del hangar)
let naves = [
    {
        imagen: null,
        nombre: "X-Wing",
        tipo: "caza",
        velocidad: 1050,
        tripulacion: 1,
        estado: "operativa"
    },
    {
        imagen: null,
        nombre: "Millennium Falcon",
        tipo: "transporte",
        velocidad: 1200,
        tripulacion: 4,
        estado: "operativa"
    },
    {
        imagen: null,
        nombre: "Y-Wing",
        tipo: "caza",
        velocidad: 800,
        tripulacion: 1,
        estado: "operativa"
    }
];

// ejecutar todo cuando el dom está cargado
document.addEventListener("DOMContentLoaded", () => {

// cargar todas las funciones iniciales al abrir la pagina
    cargarNaves();
    mostrarPilotos();
    cargarPilotos();
    pintarKanban();
    actualizarDashboard();

    // evento para añadir una misión
    document.getElementById("btnAñadirMision")
        .addEventListener("click", añadirMision);

    // evento para guardar o editar piloto
    document.getElementById("formPiloto")
        .addEventListener("submit", guardarPiloto);

    // evento para filtrar misiones por dificultad
    document.getElementById("filtroDificultad")
        .addEventListener("change", filtrarMisiones);
});


// seccion 1 — cargar naves en el hangar
function cargarNaves() {

    const hangar = document.getElementById("contenedorNaves");

    hangar.innerHTML = "";

    naves.forEach(nave => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.dataset.tipo = nave.tipo;

        card.innerHTML = `
        <h3>${nave.nombre}</h3>
        <p>Tipo: ${nave.tipo}</p>
        <p>Velocidad: ${nave.velocidad}</p>
        <p>Tripulación: ${nave.tripulacion}</p>
        <p>Estado: ${nave.estado}</p>
        `;

        hangar.appendChild(card);
    });

    cargarFiltroTipos();
}


// seccion 1 — filtro de tipos de naves
function cargarFiltroTipos() {

    const select = document.getElementById("filtroTipo");

    const tiposUnicos = [...new Set(naves.map(n => n.tipo))];

    tiposUnicos.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });

    const cards = document.querySelectorAll(".card");

    select.addEventListener("change", (e) => {

        const valor = e.target.value;

        cards.forEach(card => {

        if (valor === "Todos" || card.dataset.tipo === valor) {
            card.classList.remove("invisible");
        } else {
            card.classList.add("invisible");
        }
        });
    });
}


// seccion 2 — guardar piloto (crear o editar)
function guardarPiloto(e) {

    e.preventDefault();

    const piloto = {
        nombre: document.getElementById("nombre").value,
        rango: document.getElementById("rango").value,
        nave: document.getElementById("nave").value,
        victorias: parseInt(document.getElementById("victorias").value),
        estado: document.getElementById("estado").value
    };

    if (editIndex === null) {
        pilotos.push(piloto);
    } else {
        pilotos[editIndex] = piloto;
        editIndex = null;
    }

    guardarDatos();
    mostrarPilotos();
    actualizarDashboard();
}


// seccion 2 — mostrar pilotos
function mostrarPilotos() {

    const lista = document.getElementById("listaPilotos");
    lista.innerHTML = "";

    pilotos.forEach((p, i) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.rango}</td>
        <td>${p.nave}</td>
        <td>${p.victorias}</td>
        <td>${p.estado}</td>
        <td>
            <button onclick="editarPiloto(${i})">Editar</button>
            <button onclick="eliminarPiloto(${i})">Eliminar</button>
        </td>
        `;

        lista.appendChild(fila);
    });
}


// seccion 2 — editar piloto
function editarPiloto(i) {

    const p = pilotos[i];

    document.getElementById("nombre").value = p.nombre;
    document.getElementById("rango").value = p.rango;
    document.getElementById("nave").value = p.nave;
    document.getElementById("victorias").value = p.victorias;
    document.getElementById("estado").value = p.estado;

    editIndex = i;
}


// seccion 2 — eliminar piloto
function eliminarPiloto(i) {

    pilotos.splice(i, 1);

    guardarDatos();
    mostrarPilotos();
    actualizarDashboard();
}


// seccion 2 — guardar pilotos en localstorage
function guardarDatos() {
    localStorage.setItem("pilotos", JSON.stringify(pilotos));
}


// seccion 2 — cargar pilotos en select de misiones
function cargarPilotos() {

    const select = document.getElementById("selectPiloto");

    pilotos.forEach(p => {

        const option = document.createElement("option");

        option.value = p.nombre;
        option.textContent = p.nombre;

        select.appendChild(option);
    });
}


// seccion 3 — añadir misión
function añadirMision() {

    const mision = {
        id: Date.now(),
        nombre: document.getElementById("nombreMision").value,
        descripcion: document.getElementById("descripcionMision").value,
        piloto: document.getElementById("selectPiloto").value,
        dificultad: document.getElementById("selectDificultad").value,
        estado: "todo"
    };

    if (!mision.nombre || mision.dificultad === "default") return;

    misiones.push(mision);

    guardarMisiones();
    pintarKanban();
    actualizarDashboard();
}


// seccion 3 — pintar kanban
function pintarKanban(lista = misiones) {

    document.querySelectorAll(".columna").forEach(c => c.innerHTML = "");

    lista.forEach(m => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <h4>${m.nombre}</h4>
        <p>${m.descripcion}</p>
        <p>${m.piloto}</p>
        <p>${m.dificultad}</p>

        <button onclick="moverMision(${m.id}, -1)">⬅</button>
        <button onclick="moverMision(${m.id}, 1)">➡</button>
        <button onclick="eliminarMision(${m.id})">X</button>
        `;

        const col = document.querySelector(`[data-estado="${m.estado}"]`);
        if (col) col.appendChild(card);
    });
}


// seccion 3 — guardar misiones
function guardarMisiones() {
    localStorage.setItem("misiones", JSON.stringify(misiones));
}


// seccion 3 — mover misión
function moverMision(id, dir) {

    const m = misiones.find(x => x.id === id);
    if (!m) return;

    const estados = ["todo", "in_progress", "done"];

    let i = estados.indexOf(m.estado);
    i += dir;

    if (i >= 0 && i < estados.length) {
        m.estado = estados[i];
    }

    guardarMisiones();
    pintarKanban();
    actualizarDashboard();
}


// seccion 3 — eliminar misión
function eliminarMision(id) {

    misiones = misiones.filter(m => m.id !== id);

    guardarMisiones();
    pintarKanban();
    actualizarDashboard();
}


// seccion 3 — filtrar misiones
function filtrarMisiones(e) {

    const valor = e.target.value;

    if (valor === "default") {
    pintarKanban();
    } else {
    pintarKanban(misiones.filter(m => m.dificultad === valor));
    }
}


// seccion 4 — dashboard
function actualizarDashboard() {

    document.getElementById("totalNaves").textContent =
        `Total de naves: ${naves.length}`;

    document.getElementById("totalPilotos").textContent =
        `Total de pilotos: ${pilotos.length}`;

    const done = misiones.filter(m => m.estado === "done").length;

    document.getElementById("totalMisiones").textContent =
        `Total misiones: ${misiones.length}`;

    const total = misiones.length;
    const porcentaje = total ? (done / total) * 100 : 0;

    const barra = document.getElementById("barraProgreso");

    barra.style.width = porcentaje + "%";
    barra.textContent = Math.round(porcentaje) + "%";
}