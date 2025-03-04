document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Por favor, inicia sesión primero.');
        window.location.href = 'index.html';
        return;
    }

    await mostrarTareas();

    document.getElementById('nuevaTareaForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const title = document.getElementById('nuevaTarea').value;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
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
                'Authorization': `Bearer ${token}`,
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

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.onclick = () => editarTarea(tarea._id, tarea.title);
    
    const borrarBtn = document.createElement('button');
    borrarBtn.textContent = 'Borrar';
    borrarBtn.onclick = () => borrarTarea(tarea._id);

    li.appendChild(editarBtn);
    li.appendChild(borrarBtn);
    
    return li;
}

// Función para editar tarea
async function editarTarea(id, title) {
    const nuevoTitulo = prompt("Ingrese el nuevo título:", title);
    if (nuevoTitulo) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: nuevoTitulo }),
            });

            if (response.ok) {
                document.getElementById('tareasList').innerHTML = ''; // Limpiar la lista
                await mostrarTareas(); // Volver a cargar las tareas
            } else {
                alert('Error al editar la tarea');
            }
        } catch (error) {
            console.error('Error al editar la tarea:', error);
        }
    }
}

// Función para borrar tarea
async function borrarTarea(id) {
    const confirmacion = confirm("¿Estás seguro de que deseas borrar esta tarea?");
    if (confirmacion) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                document.getElementById('tareasList').innerHTML = ''; // Limpiar la lista
                await mostrarTareas(); // Volver a cargar las tareas
            } else {
                alert('Error al borrar la tarea');
            }
        } catch (error) {
            console.error('Error al borrar la tarea:', error);
        }
    }
}