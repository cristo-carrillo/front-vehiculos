//funciones propias de la app
const urlApi = "http://localhost:8080";//colocar la url con el puerto
const bearer = "Bearer ";
var isUser = true;

async function login() {
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    console.log(jsonData);
    var settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi + "/auth/login", settings);
    //console.log(await request.text());
    if (request.ok) {
        const respuesta = await request.json();
        localStorage.token = respuesta.data.Token;

        //localStorage.token = respuesta;
        localStorage.email = jsonData.email;
        location.href = "dashboard.html";
    }
}

function listar() {
    isUser = true;
    var nameListUser = `<i class="fa-solid fa-users"></i> List of Users`;
    document.getElementById("nameList").innerHTML = nameListUser;
    var headerListUsers = `<tr>
    <th scope="col">#</th>
    <th scope="col">First Name</th>
    <th scope="col">Last Name</th>
    <th scope="col">Email</th>
    <th scope="col">Action</th>
  </tr>`;
    document.getElementById("headerListar").innerHTML = headerListUsers;
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
    }
    fetch(urlApi + "/user", settings)
        .then(response => response.json())
        .then(function (users) {

            var usuarios = '';
            for (const usuario of users.data) {
                usuarios += `
                <tr>
                    <th scope="row">${usuario.id}</th>
                    <td>${usuario.firstName}</td>
                    <td>${usuario.lastName}</td>
                    <td>${usuario.email}</td>
                    <td>
                    <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;

            }
            document.getElementById("listar").innerHTML = usuarios;
        })
}

function listarCars() {
    isUser = false;
    var nameListCar = `<i class="fa-solid fa-car"></i> List of Cars`;
    document.getElementById("nameList").innerHTML = nameListCar;
    var headerListCars = `<tr>
    <th scope="col">#</th>
    <th scope="col">Brand</th>
    <th scope="col">Model</th>
    <th scope="col">Color</th>
    <th scope="col">Model Year</th>
    <th scope="col">Price</th>
    <th scope="col">User</th>
    <th scope="col">Action</th>
  </tr>`;
    document.getElementById("headerListar").innerHTML = headerListCars;
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
    }
    fetch(urlApi + "/api/v1/car", settings)
        .then(response => response.json())
        .then(function (cars) {

            var carsBody = '';
            for (const car of cars.data) {
                //console.log(usuario.email)
                carsBody += `
                <tr>
                    <th scope="row">${car.id}</th>
                    <td>${car.brand}</td>
                    <td>${car.model}</td>
                    <td>${car.color}</td>
                    <td>${car.modelYear}</td>
                    <td>${car.price}</td>
                    <td>${car.user.firstName}</td>
                    <td>
                    <a href="#" onclick="verModificarCarro('${car.id}')" class="btn btn-outline-warning">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </a>
                    <a href="#" onclick="verCarro('${car.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;

            }
            document.getElementById("listar").innerHTML = carsBody;
        })
}


function verModificarUsuario(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then(response => response.json())
        .then(function (response) {
            var cadena = '';
            var usuario = response.data;
            if (usuario) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="firstName" id="firstName" required value="${usuario.firstName}"> <br>
                    <label for="lastName"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="lastName" id="lastName" required value="${usuario.lastName}"> <br>
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" id="email" required value="${usuario.email}"> <br>
                    <label for="birthday" class="form-label">Birthday</label>
                    <input type="date" class="form-control" name="birthday" id="birthday" required value="${fortameDate(usuario.birthday)}"> <br>
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" name="address" id="address" required value="${usuario.address}"> <br>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

async function modificarUsuario(id) {
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/user/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha modificado el usuario exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verModificarCarro(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
    }
    fetch(urlApi + "/api/v1/car/" + id, settings)
        .then(response => response.json())
        .then(function (response) {
            var cadena = '';
            var car = response.data;
            if (car) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-pen-to-square"></i> Modificar Carro</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${car.id}">
                    <label for="brand" class="form-label">Brand</label>
                    <input type="text" class="form-control" name="brand" id="brand" required value="${car.brand}"> <br>
                    <label for="model"  class="form-label">Model</label>
                    <input type="text" class="form-control" name="model" id="model" required value="${car.model}"> <br>
                    <label for="color" class="form-label">Color</label>
                    <input type="text" class="form-control" name="color" id="color" required value="${car.color}"> <br>
                    <label for="modelYear" class="form-label">Model Year</label>
                    <input type="text" class="form-control" name="modelYear" id="modelYear" required value="${car.modelYear}"> <br>
                    <label for="vin" class="form-label">Vin</label>
                    <input type="text" class="form-control" name="vin" id="vin" required value="${car.vin}"> <br>
                    <label for="price" class="form-label">Price</label>
                    <input type="text" class="form-control" name="price" id="price" required value="${car.price}"> <br>
                    <label for="availability" class="form-label">Availability</label>
                    <input type="select" class="form-control" name="availability" id="availability" required value="${car.availability}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCarro('${car.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

async function modificarCarro(id) {
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/api/v1/car/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarCars();
    alertas("Se ha modificado el vehiculo exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then(response => response.json())
        .then(function (response) {
            var cadena = '';
            var usuario = response.data;
            if (usuario) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Nombre: ${usuario.firstName}</li>
                    <li class="list-group-item">Apellido: ${usuario.lastName}</li>
                    <li class="list-group-item">Correo: ${usuario.email}</li>
                    <li class="list-group-item">Cumpleaños: ${fortameDate(usuario.birthday)}</li>
                    <li class="list-group-item">Direccion: ${usuario.address}</li>
                </ul>`;

            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

function alertas(mensaje, tipo) {
    var color = "";
    if (tipo == 1) {//success verde
        color = "success"
    }
    else {//danger rojo
        color = "danger"
    }
    var alerta = `<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("datos").innerHTML = alerta;
}

function registerForm() {
    let cadena = ``;
    if (isUser) {
        cadena = formRegisterUser();
    } else {
        cadena = formRegisterCar();
    }
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();
}

function formRegisterUser() {
    return `
    <div class="p-3 mb-2 bg-light text-dark">
        <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> User Register</h1>
    </div>
      
    <form action="" method="post" id="registerForm">
        <input type="hidden" name="id" id="id">
        <label for="firstName" class="form-label">First Name</label>
        <input type="text" class="form-control" name="firstName" id="firstName" required> <br>
        <label for="lastName"  class="form-label">Last Name</label>
        <input type="text" class="form-control" name="lastName" id="lastName" required> <br>
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" name="email" id="email" required> <br>
        <label for="birthday" class="form-label">Birthday</label>
        <input type="date" class="form-control" name="birthday" id="birthday" required> <br>
        <label for="address" class="form-label">Address</label>
        <input type="text" class="form-control" name="address" id="address" required> <br>
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" name="password" required> <br>
        <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
    </form>`;
}

function formRegisterCar() {
    return `
    <div class="p-3 mb-2 bg-light text-dark">
        <h1 class="display-5"><i class="fa-solid fa-car"></i> Car Register</h1>
    </div>
      
    <form action="" method="post" id="registerForm">
        <label for="id" class="form-label">Id Carro</label><br>
        <input type="number" class="form-control" name="id" id="id" required> <br>
        <label for="emailUser" class="form-label">Email</label><br>
        <input type="email" class="form-control" name="emailUser" id="emailUser" required> <br>
        <button type="button" class="btn btn-outline-info" onclick="registerCar()">Registrar</button>
    </form>`;
}

async function registrarUsuario() {
    var myForm = document.getElementById("registerForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/user", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha registrado el usuario exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

async function registerCar() {
    var myForm = document.getElementById("registerForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/api/v1/car", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer + localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarCars();
    alertas("Se ha registrado el Vehiculo exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto, funcion) {
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir() {
    isUser = true;
    localStorage.clear();
    location.href = "index.html";
}

function validaToken() {
    if (localStorage.token == undefined) {
        salir();
    }
}

function fortameDate(dateFormat) {
    const [date, hour] = dateFormat.split("T");
    return date;
}