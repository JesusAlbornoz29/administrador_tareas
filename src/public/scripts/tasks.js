document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    // Verificar si hay un token
    if (!token) {
        alert('Por favor, inicia sesión primero.');
        window.location.href = 'index.html';
        return;
    }

    // Mostrar tareas al cargar la página
    await mostrarTareas();

    // Manejar el envío del formulario para crear una nueva tarea
    document.getElementById('nuevaTareaForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const title = document.getElementById('nuevaTarea').value;
        const token = localStorage.getItem('token');
    
        // Decodifica el token para obtener el userId
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId; // Asegúrate de que tu token contenga el userId
    
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, userId }), // Incluir userId
            });
    
            if (response.ok) {
                const nuevaTarea = await response.json();
                document.getElementById('tareasList').appendChild(crearElementoTarea(nuevaTarea));
                document.getElementById('nuevaTarea').value = '';
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            alert('Error en el servidor');
        }
    });
});

// Función para mostrar tareas
async function mostrarTareas() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/tasks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token
            },
        });

        if (response.ok) {
            const tareas = await response.json();
            tareas.forEach(tarea => {
                document.getElementById('tareasList').appendChild(crearElementoTarea(tarea));
            });
        } else {
            alert('Error al cargar las tareas');
        }
    } catch (error) {
        console.error('Error al mostrar tareas:', error);
    }
}

// Función para crear un elemento de tarea
function crearElementoTarea(tarea) {
    const li = document.createElement('li');
    li.textContent = tarea.title;
    return li;
}