//Array de pilotos (cargado desde localStorage o vacío)
let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];

//Índice del piloto en edición
let editIndex = null;

//Naves desplegables
let naves = [
    {
        nombre: "X-Wing",
        tipo: "caza",
        velocidad: 1050,
        tripulacion: 1,
        estado: "operativa"
    },
    {
        nombre: "Y-Wing",
        tipo: "bombardero",
        velocidad: 1000,
        tripulacion: 2,
        estado: "en reparación"
    },
    {
        nombre: "A-Wing",
        tipo: "interceptor",
        velocidad: 1300,
        tripulacion: 1,
        estado: "operativa"
    },
    {
        nombre: "Millennium Falcon",
        tipo: "transporte",
        velocidad: 1200,
        tripulacion: 4,
        estado: "operativa"
    },
    {
        nombre: "Nebulon-B",
        tipo: "fragata",
        velocidad: 800,
        tripulacion: 850,
        estado: "operativa"
    },
    {
        nombre: "CR90 Corvette",
        tipo: "corbeta",
        velocidad: 900,
        tripulacion: 150,
        estado: "en reparación"
    }
];

//Cargar naves en el select
function cargarNaves() {
    const select = document.getElementById("nave");

    naves.forEach(nave => {
    const option = document.createElement("option");
    option.value = nave.nombre;
    option.textContent = nave.nombre;
    select.appendChild(option);
    });
}

//Guardar pilotos en localStorage
function guardarDatos() {
    localStorage.setItem("pilotos", JSON.stringify(pilotos));
}

//Mostrar pilotos en la tabla
function mostrarPilotos() {
    const lista = document.getElementById("listaPilotos");
    lista.innerHTML = "";

    pilotos.forEach((piloto, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
        <td>${piloto.nombre}</td>
        <td>${piloto.rango}</td>
        <td>${piloto.nave}</td>
        <td>${piloto.victorias}</td>
        <td>${piloto.estado}</td>
        <td>
            <button onclick="editarPiloto(${index})">Editar</button>
            <button onclick="eliminarPiloto(${index})">Eliminar</button>
        </td>
        `;

        lista.appendChild(fila);
    });
}

//Formulario de añadir y editar piloto
document.getElementById("formPiloto").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const rango = document.getElementById("rango").value.trim();
    const nave = document.getElementById("nave").value;
    const victorias = parseInt(document.getElementById("victorias").value);
    const estado = document.getElementById("estado").value;

    //Validación de campos
    if (!nombre || !rango || !nave || !estado || victorias < 0) {
        alert("Completa todos los campos correctamente");
        return;
    }

    const piloto = { nombre, rango, nave, victorias, estado };

    //Crear o editar piloto
    if (editIndex === null) {
        pilotos.push(piloto);
    } else {
        pilotos[editIndex] = piloto;
        editIndex = null;
    }

    guardarDatos();
    mostrarPilotos();
    this.reset();
});

//Editar piloto seleccionado
function editarPiloto(index) {
    const piloto = pilotos[index];

    document.getElementById("nombre").value = piloto.nombre;
    document.getElementById("rango").value = piloto.rango;
    document.getElementById("nave").value = piloto.nave;
    document.getElementById("victorias").value = piloto.victorias;
    document.getElementById("estado").value = piloto.estado;

    editIndex = index;
}

//Eliminar piloto con confirmación
function eliminarPiloto(index) {
    if (confirm("¿Seguro que quieres eliminar este piloto?")) {
        pilotos.splice(index, 1);
        guardarDatos();
        mostrarPilotos();
    }
}

//Inicializar datos al cargar la página
cargarNaves();
mostrarPilotos();