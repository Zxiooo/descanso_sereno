document.addEventListener('DOMContentLoaded', function() {
    const runInput = document.getElementById('id_RUN');
    const nombresInput = document.getElementById('id_Nombres');
    const apellidosInput = document.getElementById('id_Apellidos');
    const correoInput = document.getElementById('id_Contacto');
    const rolInput = document.getElementById('id_Rol');
    const submitButton = document.getElementById('submit-button');
    const rutError = document.getElementById('rut-error');
    const nombresError = document.getElementById('nombres-error');
    const apellidosError = document.getElementById('apellidos-error');
    const correoError = document.getElementById('email-error');
    const rolError = document.getElementById('rol-error');

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

    function validarCorreo(correo) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(cl|com)$/;
        return regex.test(correo);
    }

    function validarTexto(texto) {
        const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)?(?: [a-zA-Z]+)?$/; // Permite un máximo de dos espacios
        return regex.test(texto);
    }

    function validateForm(event) {
        const run = runInput.value;
        const nombres = nombresInput.value;
        const apellidos = apellidosInput.value;
        const correo = correoInput.value;
        const rol = rolInput.value;
        let formIsValid = true;

        if (!validarRUT(run)) {
            rutError.textContent = "El RUT ingresado no es válido.";
            formIsValid = false;
        } else {
            rutError.textContent = "";
        }

        if (!validarCorreo(correo)) {
            correoError.textContent = "El correo electrónico debe terminar en .cl o .com";
            formIsValid = false;
        } else {
            correoError.textContent = "";
        }

        if (!validarTexto(nombres)) {
            nombresError.textContent = "El nombre solo debe contener letras y un máximo de dos espacios entre palabras.";
            formIsValid = false;
        } else {
            nombresError.textContent = "";
        }

        if (!validarTexto(apellidos)) {
            apellidosError.textContent = "El apellido solo debe contener letras y un máximo de dos espacios entre palabras.";
            formIsValid = false;
        } else {
            apellidosError.textContent = "";
        }

        if (!validarTexto(rol)) {
            rolError.textContent = "El rol solo debe contener letras y un máximo de dos espacios entre palabras.";
            formIsValid = false;
        } else {
            rolError.textContent = "";
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
            nombresError.textContent = "El nombre solo debe contener letras y un máximo de dos espacios entre palabras.";
        } else {
            nombresError.textContent = "";
        }
    });

    apellidosInput.addEventListener('input', function(event) {
        if (!validarTexto(event.target.value)) {
            apellidosError.textContent = "El apellido solo debe contener letras y un máximo de dos espacios entre palabras.";
        } else {
            apellidosError.textContent = "";
        }
    });

    correoInput.addEventListener('input', function(event) {
        if (!validarCorreo(event.target.value)) {
            correoError.textContent = "El correo electrónico debe terminar en .cl o .com";
        } else {
            correoError.textContent = "";
        }
    });

    rolInput.addEventListener('input', function(event) {
        if (!validarTexto(event.target.value)) {
            rolError.textContent = "El rol solo debe contener letras y un máximo de dos espacios entre palabras.";
        } else {
            rolError.textContent = "";
        }
    });

    submitButton.addEventListener('click', validateForm);
});
