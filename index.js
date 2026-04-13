document.addEventListener("DOMContentLoaded", () => {
    //Array naves
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
        estado: "operativa",
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
    // a;adir el array naves al hangar
    const hangar = document.getElementById("contenedorNaves")
    naves.forEach(nave=>{
        //crear card pa guardar la nave
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.tipo = nave.tipo;

        // crear elemento img con la imagen y el src
        const img = document.createElement("img");
        img.src = nave.imagen;
        img.alt = nave.nombre;

        // crear elemento h3 con nombre
        const titulo = document.createElement("h3");
        titulo.textContent = nave.nombre;

        // crear elemento p con tipo
        const tipo = document.createElement("p");
        tipo.textContent = `Tipo: ${nave.tipo}`;

        // crear elemento p con velocidad
        const velocidad = document.createElement("p");
        velocidad.textContent = `Velocidad: ${nave.velocidad}`;

        // crear elemento p con tripulación
        const tripulacion = document.createElement("p");
        tripulacion.textContent = `Tripulación: ${nave.tripulacion}`;

        // crear elemento p con estado
        const estado = document.createElement("p");
        estado.textContent = `Estado: ${nave.estado}`;

        // meter todo en la card
        card.appendChild(img);
        card.appendChild(titulo);
        card.appendChild(tipo);
        card.appendChild(velocidad);
        card.appendChild(tripulacion);
        card.appendChild(estado);
        // meter card en hangar
        hangar.appendChild(card);
    });
    
    

    //Meterle al boton de filtro solo los tipos Existentes
    const tiposUnicos = [...new Set(naves.map(n => n.tipo))];
    const select = document.getElementById("filtroTipo");

    tiposUnicos.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });

    //NO TOCAR, IMPORTANTE PARA EL BUSCADOR Y EL FILTRO
    const navesVisibles = document.querySelectorAll(".card");
    //NO TOCAR, IMPORTANTE PARA EL BUSCADOR Y EL FILTRO

    //Filtrar
    select.addEventListener("change", (e) => {

        const valor = e.target.value;

        if (valor !== "Todos") {
            navesVisibles.forEach(nave => {
                if (nave.dataset.tipo !== valor) {
                    nave.classList.add("invisible");
                } else {
                    nave.classList.remove("invisible");
                }
            });
        } else {
            navesVisibles.forEach(nave => {
                nave.classList.remove("invisible");
            });
        }
    });


    //render
    function render(lista) {
    hangar.innerHTML = "";

    lista.forEach(nave => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.tipo = nave.tipo; 

        const img = document.createElement("img"); 
        img.src = nave.imagen;                     
        img.alt = nave.nombre;                     

        const titulo = document.createElement("h3");
        titulo.textContent = nave.nombre;

        const tipo = document.createElement("p");
        tipo.textContent = `Tipo: ${nave.tipo}`;

        const velocidad = document.createElement("p");
        velocidad.textContent = `Velocidad: ${nave.velocidad}`;

        const tripulacion = document.createElement("p");
        tripulacion.textContent = `Tripulación: ${nave.tripulacion}`;

        const estado = document.createElement("p");
        estado.textContent = `Estado: ${nave.estado}`;

        card.appendChild(img);         
        card.appendChild(titulo);
        card.appendChild(tipo);
        card.appendChild(velocidad);
        card.appendChild(tripulacion);
        card.appendChild(estado);

        hangar.appendChild(card);
    });
};
    

    //Ordenar por velocidad
    const speed = document.getElementById("ordenar")
    let contadorSpeed = 0; 
    speed.addEventListener("click", ()=>{
        contadorSpeed++;
        if (contadorSpeed%2==0){
            naves.sort((a, b) => b.velocidad - a.velocidad);
        } else {
            naves.sort((a, b) => a.velocidad - b.velocidad);
        }
       render(naves); 
    });

    //Buscar Nave
    const buscador = document.getElementById("buscador")
    buscador.addEventListener("input", (e) => {
        navesVisibles.forEach(nave => {
            const nombre = nave.querySelector("h3").textContent.toLowerCase();
            if (!nombre.includes(buscador.value.toLowerCase())) {
                nave.classList.add("invisible");
            } else {
                nave.classList.remove("invisible");
            }
        });
    });

















    
    
    
    // Cargar naves en el select del formulario de pilotos
    function cargarNaves() {
    const select = document.getElementById("nave");
    naves.forEach(nave => {
        const option = document.createElement("option");
        option.value = nave.nombre;
        option.textContent = nave.nombre;
        select.appendChild(option);
    });
}



// Formulario de añadir y editar piloto
document.getElementById("formPiloto").addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const rango = document.getElementById("rango").value.trim();
    const nave = document.getElementById("nave").value;
    const victorias = parseInt(document.getElementById("victorias").value);
    const estado = document.getElementById("estado").value;
    // Validación de campos
    if (!nombre || !rango || !nave || !estado || victorias < 0) {
        alert("Completa todos los campos correctamente");
        return;
    }
    const piloto = { nombre, rango, nave, victorias, estado };
    // Crear o editar piloto
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


// Inicializar
cargarNaves();
mostrarPilotos();

});


//Esto de aqui debajo se tiene que quedar fuera del domcontentloader pq si no no funciona
//Puesto que usa elementos del propio html y que no tienen nada que ver con el dom


// Array de pilotos (cargado desde localStorage o vacío)
let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
// Índice del piloto en edición
let editIndex = null;


// Editar piloto seleccionado
function editarPiloto(index) {
    const piloto = pilotos[index];
    document.getElementById("nombre").value = piloto.nombre;
    document.getElementById("rango").value = piloto.rango;
    document.getElementById("nave").value = piloto.nave;
    document.getElementById("victorias").value = piloto.victorias;
    document.getElementById("estado").value = piloto.estado;
    editIndex = index;
}

// Eliminar piloto con confirmación
function eliminarPiloto(index) {
    if (confirm("¿Seguro que quieres eliminar este piloto?")) {
        pilotos.splice(index, 1);
        guardarDatos();
        mostrarPilotos();
    }
}

// Guardar pilotos en localStorage
function guardarDatos() {
    localStorage.setItem("pilotos", JSON.stringify(pilotos));
}

// Mostrar pilotos en la tabla
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


