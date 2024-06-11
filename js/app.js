//Variables

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargaraddEventListener();
function cargaraddEventListener() {
  //Cuando agregas un curso presionando "Aggregar al Carrito"
  listaCursos.addEventListener("click", agregarCurso);
  //Eliminar cursos del carrito
  carrito.addEventListener("click", eliminarCurso);
  //Muestra los cursos de Local Storage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHTML();
  });
  //Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; // resetiamos el arreglo
    limpiarHTML(); // Eliminamos todo el HTML
  });
}

//Funciones
function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

//Elimina un curso del carrito.
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");
    // Busca el curso en el arreglo
    const curso = articulosCarrito.find((curso) => curso.id === cursoId);

    if (curso.cantidad > 1) {
      // Disminuye la cantidad
      curso.cantidad--;
    } else {
      // Elimina del arreglo articulosCarrito por el data-id
      articulosCarrito = articulosCarrito.filter(
        (curso) => curso.id !== cursoId
      );
    }
    carritoHTML(); // Llamamos a la funcion para iterar sobre el carrito y mostrar el html con el articulo sacado
  }
}

//Esta funcion lee el contendido del html al que le dimos click y extrae la info del curso
function leerDatosCurso(curso) {
  //Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    //Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // retorna el objeto actualizado
      } else {
        return curso; // retorna los objetos que no son los duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    //Agregamos los elementos al arreglo de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);
  carritoHTML();
}

//Muestra el carrito de compras en el html
function carritoHTML() {
  //Antes de generar el HTML debemos Limpiarlo
  limpiarHTML();

  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <img src="${imagen}" width="100">
        </td>
        <td>
            ${titulo}
        </td>
        <td>
        ${precio}
       </td>
       <td>
       ${cantidad}
       </td>
       <td>
        <a href="#" class="borrar-curso" data-id="${id}"> X </a>
       </td>
        `;
    //Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

  //Agregar el carrito de compras al LocalStorage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//Elimina los cursos del tbody
function limpiarHTML() {
  //Forma lenta
  //contenedorCarrito.innerHTML = "";

  //Forma rapida
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
