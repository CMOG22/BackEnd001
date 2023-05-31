function generarId() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const longitud = 10;
    let id = '';

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        id += caracteres.charAt(indice);
    }
    return id;
}

//almacenar datos
const datos = JSON.parse(localStorage.getItem('datos')) || [];

const formulario = document.querySelector('#formulario');
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = generarId();
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const price = document.querySelector('#price').value;
    const thumbnail = document.querySelector('#thumbnail').value;
    const code = document.querySelector('#code').value;
    const stock = document.querySelector('#stock').value;

    if (id.trim() === '' || title.trim() === '' || description.trim() === '' || price.trim() === '' || thumbnail.trim() === '' || code.trim() === '' || stock.trim() === '') {
        Toastify({
            text: "Completa los campos obligatorios",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        }).showToast();
        return;
    }

    //Agregar datos al Array
    datos.push({
        id: id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
    });

    //Guardar los datos en localstorage
    localStorage.setItem('datos',JSON.stringify(datos));

    //Limpiar campos del formulario
    //document.querySelector('#id').value = '';
    document.querySelector('#title').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#thumbnail').value = '';
    document.querySelector('#code').value = '';
    document.querySelector('#stock').value = '';
    
    actualizarTabla();
});
function actualizarTabla() {
    const tabla = document.querySelector('#tabla-datos');
    tabla.innerHTML = ''; //limpia la tabla antes de agregar los nuevos datos

    datos.forEach((dato, indice) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${dato.id}</td>
        <td>${dato.title}</td>
        <td>${dato.description}</td>
        <td>${dato.price}</td>
        <td><img src="${dato.thumbnail}" alt="No Image" width="100" height="100"></td>
        <td>${dato.code}</td>
        <td>${dato.stock}</td>
        <td>
            <button onclick="eliminar(${indice})">Eliminar</button>
            <button onclick="editar(${indice})">Editar</button>
        </td>
    `;
    tabla.appendChild(fila);
    });
}

function eliminar(indice) {
    datos.splice(indice, 1); //elimina dato del array

    //guarda los datos actualizados del array
    localStorage.setItem('datos',JSON.stringify(datos));

    actualizarTabla();
}

function editar(indice) {
    const dato = datos[indice];

    document.querySelector('#title').value = dato.title;
    document.querySelector('#description').value = dato.description;
    document.querySelector('#price').value = dato.price;
    document.querySelector('#thumbnail').value = dato.thumbnail;
    document.querySelector('#code').value = dato.code;
    document.querySelector('#stock').value = dato.stock;

    //elimina dato original
    datos.splice(indice, 1);

    //guarda datos actualiados
    localStorage.setItem('datos', JSON.stringify(datos));

    // Cambiar la función del botón "Agregar" para que actualice el dato en lugar de agregar uno nuevo
    const botonAgregar = document.querySelector('#formulario button');
    botonAgregar.innerHTML = 'Actualizar';
    botonAgregar.removeEventListener('click', agregar);
    botonAgregar.addEventListener('click', () => {
        const id = document.querySelector('#id').value;
        const title = document.querySelector('#title').value;
        const description = document.querySelector('#description').value;
        const price = document.querySelector('#price').value;
        const thumbnail = document.querySelector('#thumbnail').value;
        const code = document.querySelector('#code').value;
        const  stock= document.querySelector('#stock').value;

        //agregar los nuevos datos al array
        datos.splice(indice, 0, {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        });

        //limpiar los campos del formulario
        document.querySelector('#id').value = '';
        document.querySelector('#title').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#price').value = '';
        document.querySelector('#thumbnail').value = '';
        document.querySelector('#code').value = '';
        document.querySelector('#stock').value = '';

        ///Cambiar la función del botón "Actualizar" para que agregue un nuevo dato en lugar de actualizar uno existente
        botonAgregar.innerHTML = 'Agregar';
        botonAgregar.removeEventListener('click', actualizar);
        botonAgregar.addEventListener('click', agregar);

        //guardar datos actualizados
        localStorage.setItem('datos',JSON.stringify(datos));

        actualizarTabla();
    });
}

//Buscar
function buscar() {
    const input = document.getElementById("buscar");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("tabla-datos");
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const td = tr[i]. getElementsByTagName("td")[0];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

//buscar por codigo
function buscarPorCodigo() {
    const inputCodigo = document.getElementById("buscarCodigo");
    const filtroCodigo = inputCodigo.value.toUpperCase();

    const datosFiltrados = datos.filter(dato => dato.code.toUpperCase().includes(filtroCodigo));

    const tabla = document.querySelector('#tabla-datos');
    tabla.innerHTML = '';

    datosFiltrados.forEach(dato => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${dato.id}</td>
            <td>${dato.title}</td>
            <td>${dato.description}</td>
            <td>${dato.price}</td>
            <td><img src="${dato.thumbnail}" alt="No Image" width="100" height="100"></td>
            <td>${dato.code}</td>
            <td>${dato.stock}</td>
            <td>
                <button onclick="eliminar(${datos.indexOf(dato)})">Eliminar</button>
                <button onclick="editar(${datos.indexOf(dato)})">Editar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}