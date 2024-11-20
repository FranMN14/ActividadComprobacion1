// Añadir un evento al formulario para manejar el envío de datos
document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir la recarga de la página al enviar el formulario

    // Obtiene los valores de los campos del formulario
    let nombre = document.getElementById('nombre').value;
    let descripcion = document.getElementById('descripcion').value;
    let fechainicio = new Date(document.getElementById('fecha-inicio').value);
    let fechafinal = new Date(document.getElementById('fecha-final').value);
    let costopordia = parseFloat(document.getElementById('costo-por-dia').value);

    // Verifica que todos los campos estén llenos
    if(nombre && descripcion && fechainicio && fechafinal && costopordia){
        // Calcula la duración del anuncio en días
        let duracion = Math.floor((fechafinal - fechainicio) / (1000 * 60 * 60 * 24));
        if (duracion < 0){
            alert('La fecha de fin debe ser después de la fecha de inicio');
            return;
        }
        // Calcula el costo total del anuncio
        let costototal = duracion * costopordia;

        // Crea un objeto con los datos del anuncio
        let anuncio = {
            nombre,
            descripcion,
            fechainicio: fechainicio.toISOString().split('T')[0],
            fechafinal: fechafinal.toISOString().split('T')[0],
            duracion,
            costototal
        };

        // Guarda el anuncio en localStorage y actualizar la interfaz
        GuardarAnuncio(anuncio);
        RenderizarAnuncios();
        CalcularCostoTotal();
        // Limpia el formulario después de registrar el anuncio
        document.getElementById('formulario').reset();
    } else {
        // Muestra un mensaje de error si algún campo está vacío
        alert('Por favor, completa todos los espacios');
    }
});

// Funcion para guardar un anuncio en localStorage
function GuardarAnuncio(anuncio) {
    let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    anuncios.push(anuncio);
    localStorage.setItem('anuncios', JSON.stringify(anuncios));
}

// Funcion para mostrar los anuncios guardados en la tabla
function RenderizarAnuncios() {
    let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    let cuerpotabla = document.querySelector('#ListaAnuncios');
    cuerpotabla.innerHTML = ''; // Limpia la tabla antes de agregar los anuncios

    // Itera sobre los anuncios y los agrega a la tabla
    anuncios.forEach((anuncio, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${anuncio.nombre}</td>
            <td>${anuncio.descripcion}</td>
            <td>${anuncio.fechainicio}</td>
            <td>${anuncio.fechafinal}</td>
            <td>${anuncio.duracion}</td>
            <td>${anuncio.costototal.toFixed(2)}</td>
            <td><button onclick="borrarAnuncio(${index})">Eliminar</button></td>
        `;
        cuerpotabla.appendChild(fila);
    });
}

// Funcion para borrar un anuncio de la lista y de localStorage
function borrarAnuncio(index) {
    let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    anuncios.splice(index, 1); // Eliminar el anuncio del array
    localStorage.setItem('anuncios', JSON.stringify(anuncios)); // Actualizar localStorage
    RenderizarAnuncios(); // Volver a mostrar la lista de anuncios
    CalcularCostoTotal(); // Recalcular el costo total de los anuncios
}

// Funcion para calcular el costo total de todos los anuncios
function CalcularCostoTotal() {
    let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
    let costototal = anuncios.reduce((sum, anuncio) => sum + anuncio.costototal, 0);
    document.getElementById('costototal').innerText = `Costo total: $${costototal.toFixed(2)}`;
}

// Evento que se ejecutara cuando el contenido del DOM ha sido cargado
document.addEventListener('DOMContentLoaded', function() {
    RenderizarAnuncios();
    CalcularCostoTotal();
});
