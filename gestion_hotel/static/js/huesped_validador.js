document.addEventListener('DOMContentLoaded', function() {
    const runInput = document.getElementById('id_RUN');
    const nombresInput = document.getElementById('id_Nombres');
    const apellidosInput = document.getElementById('id_Apellidos');
    const emailInput = document.getElementById('id_Contacto');
    const habitacionField = document.getElementById('id_habitacion');
    const cantidadPersonasField = document.getElementById('id_Cantidad_Personas');
    const submitButton = document.getElementById('submit-button');
    const rutError = document.getElementById('rut-error');
    const nombresError = document.getElementById('nombres-error');
    const apellidosError = document.getElementById('apellidos-error');
    const emailError = document.getElementById('email-error');
    const cantidadPersonasError = document.getElementById('cantidad-personas-error');
    const habitacionInfo = document.getElementById('habitacion-info');

    function updateHabitacionInfo() {
        const habitacion = habitacionField.options[habitacionField.selectedIndex];
        const capacidadMaxima = habitacion.dataset.capacity;

        if (capacidadMaxima) {
            habitacionInfo.textContent = `Capacidad máxima: ${capacidadMaxima}.`;
        } else {
            habitacionInfo.textContent = '';
        }
    }

    function validateCantidadPersonas() {
        const habitacion = habitacionField.options[habitacionField.selectedIndex];
        const capacidadMaxima = parseInt(habitacion.dataset.capacity);
        const cantidadPersonas = parseInt(cantidadPersonasField.value);

        if (cantidadPersonasField.value === '') {
            cantidadPersonasError.textContent = '';
            submitButton.disabled = true;
        } else if (isNaN(cantidadPersonas) || cantidadPersonas < 1 || cantidadPersonas > capacidadMaxima) {
            submitButton.disabled = true;
            cantidadPersonasError.textContent = 'La cantidad de personas puesta es incorrecta';
        } else {
            submitButton.disabled = false;
            cantidadPersonasError.textContent = '';
        }
    }

    function validarRUT(rut) {
        if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
            return false;
        }
        const parts = rut.split('-');
        const number = parts[0];
        const dv = parts[1].toUpperCase();
        let sum = 0;
        let multiplier = 2;

        for (let i = number.length - 1; i >= 0; i--) {
            sum += parseInt(number[i]) * multiplier;
            multiplier = (multiplier === 7) ? 2 : multiplier + 1;
        }

        const expectedDv = 11 - (sum % 11);
        const dvChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'K'];

        return dv === dvChars[expectedDv];
    }

    function formatRUT(value) {
        const runWithoutHyphen = value.replace(/-/g, '');
        if (runWithoutHyphen.length > 8) {
            runInput.value = runWithoutHyphen.slice(0, 8) + '-' + runWithoutHyphen.slice(8);
        } else {
            runInput.value = runWithoutHyphen;
        }
    }

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(cl|com)$/;
        return regex.test(email);
    }

    function validarTexto(texto) {
        const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
        return regex.test(texto);
    }

    function validateForm(event) {
        const run = runInput.value;
        const nombres = nombresInput.value;
        const apellidos = apellidosInput.value;
        const email = emailInput.value;
        let formIsValid = true;

        if (!validarRUT(run)) {
            rutError.textContent = "El RUT ingresado no es válido.";
            formIsValid = false;
        } else {
            rutError.textContent = "";
        }

        if (!validarEmail(email)) {
            emailError.textContent = "El correo electrónico debe terminar en .cl o .com";
            formIsValid = false;
        } else {
            emailError.textContent = "";
        }

        if (!validarTexto(nombres)) {
            nombresError.textContent = "El nombre solo debe contener letras y un solo espacio entre palabras.";
            formIsValid = false;
        } else {
            nombresError.textContent = "";
        }

        if (!validarTexto(apellidos)) {
            apellidosError.textContent = "El apellido solo debe contener letras y un solo espacio entre palabras.";
            formIsValid = false;
        } else {
            apellidosError.textContent = "";
        }

        if (!formIsValid) {
            event.preventDefault();
        }
    }

    runInput.addEventListener('input', function(event) {
        formatRUT(event.target.value);
        if (!validarRUT(runInput.value)) {
            rutError.textContent = "El RUT ingresado no es válido.";
        } else {
            rutError.textContent = "";
        }
    });

    nombresInput.addEventListener('input', function(event) {
        if (!validarTexto(event.target.value)) {
            nombresError.textContent = "El nombre solo debe contener letras y un solo espacio entre palabras.";
        } else {
            nombresError.textContent = "";
        }
    });

    apellidosInput.addEventListener('input', function(event) {
        if (!validarTexto(event.target.value)) {
            apellidosError.textContent = "El apellido solo debe contener letras y un solo espacio entre palabras.";
        } else {
            apellidosError.textContent = "";
        }
    });

    emailInput.addEventListener('input', function(event) {
        if (!validarEmail(event.target.value)) {
            emailError.textContent = "El correo electrónico debe terminar en .cl o .com";
        } else {
            emailError.textContent = "";
        }
    });

    habitacionField.addEventListener('change', () => {
        updateHabitacionInfo();
        validateCantidadPersonas();
    });

    cantidadPersonasField.addEventListener('input', validateCantidadPersonas);
    submitButton.addEventListener('click', validateForm);

    window.addEventListener('DOMContentLoaded', () => {
        updateHabitacionInfo();
        validateCantidadPersonas();
    });
});
