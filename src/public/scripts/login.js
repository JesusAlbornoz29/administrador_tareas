document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
  
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        // Guardar el email en localStorage
        localStorage.setItem('email', email);
        // Redirigir a mis-tareas.html
        window.location.href = 'mis-tareas.html';
      } else {
        // Mostrar error
        alert(data.message);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error en el servidor');
    }
  });



























// window.addEventListener('load', function () {
//     /* ---------------------- obtenemos variables globales ---------------------- */
//     const form = document.forms[0];
//     const email = document.querySelector('#inputEmail')
//     const password = document.querySelector('#inputPassword')
//     const url = 'https://todo-api.ctd.academy/v1';


//     /* -------------------------------------------------------------------------- */
//     /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
//     /* -------------------------------------------------------------------------- */
//     form.addEventListener('submit', function (event) {
//         event.preventDefault();

//         //creamos el cuerpo de la request
//         const payload = {
//             email: email.value,
//             password: password.value
//         };
//         //configuramos la request del Fetch
//         const settings = {
//             method: 'POST',
//             body: JSON.stringify(payload),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         };
//         //lanzamos la consulta de login a la API
//         realizarLogin(settings);

//         //limpio los campos del formulario
//         form.reset();
//     });


//     /* -------------------------------------------------------------------------- */
//     /*                     FUNCIÓN 2: Realizar el login [POST]                    */
//     /* -------------------------------------------------------------------------- */
//     function realizarLogin(settings) {
//         console.log("Lanzando la consulta a la API...");
//         fetch(`${url}/users/login`, settings)
//             .then(response => {
//                 console.log(response);

//                 if (response.ok != true) {
//                     alert("Alguno de los datos es incorrecto.")
//                 }

//                 return response.json();

//             })
//             .then(data => {
//                 console.log("Promesa cumplida:");
//                 console.log(data);

//                 if (data.jwt) {
//                     //guardo en LocalStorage el objeto con el token
//                     localStorage.setItem('jwt', JSON.stringify(data.jwt));

//                     //redireccionamos a la página
//                     location.replace('./mis-tareas.html');
//                 }
//             }).catch(err => {
//                 console.log("Promesa rechazada:");
//                 console.log(err);
//             })
//     };


// });
