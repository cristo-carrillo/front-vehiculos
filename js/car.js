function listarCars() {
    isUser = false;
    var nameListCar = `<i class="fa-solid fa-car"></i> List of Cars`;
    document.getElementById("nameList").innerHTML = nameListCar;
    document.getElementById("headerListar").innerHTML = headerListCars();
    validaToken();
    var settings = {
        method: 'GET',
        headers: headerPetition()
    }
    fetch(urlApi + "/api/v1/car", settings)
        .then(response => response.json())
        .then(function (cars) {
            let textSuccess = "text-success";
            let textDanger = "text-danger";
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
                    <td>${car.user.email}</td>
                    <td class="${car.availability ? textSuccess : textDanger}">${car.availability}</td>
                    <td>
                    <a href="#" onclick="verModificarCarro('${car.id}')" class="btn btn-outline-warning">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </a>
                    <a href="#" onclick="getCar('${car.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;

            }
            document.getElementById("listar").innerHTML = carsBody;
        })
}

function headerListCars() {
    return `<tr>
    <th scope="col">#</th>
    <th scope="col">Brand</th>
    <th scope="col">Model</th>
    <th scope="col">Color</th>
    <th scope="col">Model Year</th>
    <th scope="col">Price</th>
    <th scope="col">User</th>
    <th scope="col">Availability</th>
    <th scope="col">Action</th>
  </tr>`;
}

function headerPetition() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': bearer + localStorage.token
    };
}

function getCar(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: headerPetition()
    }
    fetch(urlApi + "/api/v1/car/" + id, settings)
        .then(response => response.json())
        .then(function (response) {
            let cadena = '';
            var car = response.data;
            if (car) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-car"></i> Get Car</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Brand: ${car.brand}</li>
                    <li class="list-group-item">Model: ${car.model}</li>
                    <li class="list-group-item">Color: ${car.color}</li>
                    <li class="list-group-item">Model Year: ${car.modelYear}</li>
                    <li class="list-group-item">Vin: ${car.vin}</li>
                    <li class="list-group-item">Price: ${car.price}</li>
                    <li class="list-group-item">Availability: ${car.availability}</li>
                    <li class="list-group-item">User: ${car.user.email}</li>
                </ul>`;

            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
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

async function registerCar() {
    var myForm = document.getElementById("registerForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {//convertimos los datos a json
        jsonData[k] = v;
    }
    await fetch(urlApi + "/api/v1/car", {
        method: 'POST',
        headers: headerPetition(),
        body: JSON.stringify(jsonData)
    }).then(function (rp) {
        responseStatus = rp.status;
        return rp.json();
    }).then(function (response) {
        alertas(response.message, responseStatus >= 400 ? 2 : 1);
    });
    listarCars();
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
    modal.hide();
}

function verModificarCarro(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: headerPetition()
    }
    fetch(urlApi + "/api/v1/car/" + id, settings)
        .then(response => response.json())
        .then(function (response) {
            var cadena = '';
            var car = response.data;
            if (car) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-pen-to-square"></i> Update Car</h1>
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
                    <select name="availability" id="availability" class="form-select"> 
                        <option value="${car.availability}" selected>${car.availability}</option>
                        <option value="${car.availability ? false : true}">${car.availability ? false : true}</option>
                    </select>
                    <br>
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
        headers: headerPetition(),
        body: JSON.stringify(jsonData)
    });
    listarCars();
    alertas("Se ha modificado el vehiculo exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}