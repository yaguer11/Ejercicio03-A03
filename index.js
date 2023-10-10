const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Definir un prototipo para las tareas
function Task(title, description, status, creationDate, lastEditDate, dueDate, difficulty) {
  this.title = title;
  this.description = description;
  this.status = status;
  this.creationDate = creationDate;
  this.lastEditDate = lastEditDate;
  this.dueDate = dueDate;
  this.difficulty = difficulty;
}

// Método para mostrar la información de una tarea
Task.prototype.displayInfo = function () {
  console.log("\nTarea encontrada:");
  console.log(`Título: ${this.title}`);
  console.log(`Descripción: ${this.description}`);
  console.log(`Estado: ${this.status}`);
  console.log(`Fecha de creación: ${this.creationDate}`);
  console.log(`Fecha de última edición: ${this.lastEditDate}`);
  console.log(`Fecha de vencimiento: ${this.dueDate}`);
  console.log(`Dificultad: ${this.difficulty}`);
};

// Lista de tareas como un prototipo de lista enlazada
function TaskList() {
  this.head = null;
}

// Método para agregar una tarea a la lista
TaskList.prototype.addTask = function (task) {
  task.next = this.head;
  this.head = task;
};

// Método para buscar una tarea por título
TaskList.prototype.searchTask = function (title) {
  let currentTask = this.head;
  while (currentTask) {
    if (currentTask.title === title) {
      return currentTask;
    }
    currentTask = currentTask.next;
  }
  return null;
};

// Función para limpiar la pantalla
function clearScreen() {
  console.clear(); // Intenta limpiar la pantalla en la mayoría de los terminales
}

function showMenu() {
  clearScreen(); // Limpia la pantalla antes de mostrar el menú
  console.log("Menú:");
  console.log("(1) Ver mis tareas");
  console.log("(2) Buscar tarea");
  console.log("(3) Agregar tarea");
  console.log("(4) Editar tarea");
  console.log("(5) Salir");
  rl.question("Seleccione una opción: ", handleMenuChoice);
}

function handleMenuChoice(choice) {
  const choiceLower = choice.toLowerCase(); // Convertir a minúsculas
  switch (choiceLower) {
    case '1':
      showTasks();
      break;
    case '2':
      searchTask();
      break;
    case '3':
      addTask();
      break;
    case '4':
      editTask();
      break;
    case '5':
      rl.question("¿Seguro que desea salir? (S/N): ", (answer) => {
        if (answer.toLowerCase() === 's') {
          rl.close();
        } else {
          showMenu();
        }
      });
      break;
    default:
      console.log("Opción no válida. Por favor, seleccione una opción válida.");
      showMenu();
  }
}

function showTasks() {
  if (!taskList.head) {
    console.log("No hay tareas para mostrar.");
  } else {
    console.log("\nTareas:");
    let currentTask = taskList.head;
    let index = 1;
    while (currentTask) {
      console.log(`${index}. ${currentTask.title} - ${currentTask.status}`);
      currentTask = currentTask.next;
      index++;
    }
  }
  askToReturnToMenu();
}

function searchTask() {
  rl.question("Introduzca el título de la tarea a buscar: ", (title) => {
    const foundTask = taskList.searchTask(title);
    if (foundTask) {
      foundTask.displayInfo();
    } else {
      console.log("Tarea no encontrada.");
    }
    askToReturnToMenu();
  });
}

function addTask() {
  rl.question("Introduzca el título de la tarea: ", (title) => {
    rl.question("Introduzca la descripción de la tarea: ", (description) => {
      rl.question("Introduzca el estado de la tarea (Pendiente/En curso/Terminada/Cancelada): ", (status) => {
        status = normalizeOption(status); // Convertir a minúsculas
        if (isValidStatus(status)) {
          rl.question("Introduzca la fecha de vencimiento (AAAA-MM-DD): ", (dueDate) => {
            if (isValidDate(dueDate)) {
              rl.question("Introduzca la dificultad de la tarea (Facil/Medio/Dificil): ", (difficulty) => {
                difficulty = normalizeOption(difficulty); // Convertir a minúsculas
                if (isValidDifficulty(difficulty)) {
                  const currentDate = new Date().toLocaleDateString();
                  const task = new Task(title, description, status, currentDate, currentDate, dueDate, difficulty);
                  taskList.addTask(task);
                  console.log("\nTarea agregada correctamente.");
                } else {
                  console.log("Dificultad no válida. Debe ser 'Facil', 'Medio' o 'Dificil'.");
                }
                askToReturnToMenu();
              });
            } else {
              console.log("Fecha de vencimiento no válida. Debe estar en formato 'AAAA-MM-DD'.");
              askToReturnToMenu();
            }
          });
        } else {
          console.log("Estado no válido. Debe ser 'Pendiente', 'En curso', 'Terminada' o 'Cancelada'.");
          askToReturnToMenu();
        }
      });
    });
  });
}

function editTask() {
  rl.question("Introduzca el título de la tarea a editar: ", (title) => {
    const foundTask = taskList.searchTask(title);
    if (foundTask) {
      rl.question("Introduzca el nuevo estado de la tarea (Pendiente/En curso/Terminada/Cancelada): ", (status) => {
        status = normalizeOption(status); // Convertir a minúsculas y quitar acentos
        if (isValidStatus(status)) {
          foundTask.status = status;
          foundTask.lastEditDate = new Date().toLocaleDateString();
          console.log("\nTarea editada correctamente.");
        } else {
          console.log("Estado no válido. Debe ser 'Pendiente', 'En curso', 'Terminada' o 'Cancelada'.");
        }
        askToReturnToMenu();
      });
    } else {
      console.log("Tarea no encontrada.");
      askToReturnToMenu();
    }
  });
}

function askToReturnToMenu() {
  rl.question("\n¿Desea volver al menú principal? (S/N): ", (answer) => {
    if (answer.toLowerCase() === 's') {
      showMenu();
    } else {
      rl.close();
    }
  });
}

// Funciones de validación
function isValidStatus(status) {
  return ['pendiente', 'en curso', 'terminada', 'cancelada'].includes(status);
}

function isValidDate(date) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

function isValidDifficulty(difficulty) {
  return ['facil', 'medio', 'dificil'].includes(difficulty);
}

// Función para convertir a minúsculas y quitar acentos
function normalizeOption(option) {
  return option.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Crear una instancia de la lista de tareas
const taskList = new TaskList();

// Manejar el cierre del programa
rl.on('close', () => {
  console.log("\n¡Adiós!");
  process.exit(0);
});

showMenu();
