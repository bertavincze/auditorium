function onLoginButtonClicked() {
    const loginFormEl = document.forms['login-form'];

    const emailInputEl = loginFormEl.querySelector('input[name="login-input-email"]');
    const passwordInputEl = loginFormEl.querySelector('input[name="login-input-password"]');

    const email = emailInputEl.value;
    const password = passwordInputEl.value;

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLoginResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'login');

    xhr.send(params);
}

function onLoginResponse() {
    if (this.status === OK) {
        const user = JSON.parse(this.responseText);
        setAuthorization(user);
        document.location.reload();
    } else {
        onOtherResponse(this);
    }
}

function onRegisterButtonClicked() {
    const registerFormEl = document.forms['register-form'];

    const nameInputEl = registerFormEl.querySelector('input[name="register-input-name"]');
    const emailInputEl = registerFormEl.querySelector('input[name="register-input-email"]');
    const passwordInputEl = registerFormEl.querySelector('input[name="register-input-password"]');
    const roleInputEl = registerFormEl.querySelector('input[name="register-input-role"]');

    const name = nameInputEl.value;
    const email = emailInputEl.value;
    const password = passwordInputEl.value;

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('password', password);

    if (roleInputEl.checked) {
        params.append('role', roleInputEl.value);
    } else {
        params.append('role', 'regular');    
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onRegisterResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'register');
    xhr.send(params);
}

function onRegisterResponse() {
    if (this.status === OK) {
        const user = JSON.parse(this.responseText);
        alert('Thank you for registering ' + user.name + ' !');
        setAuthorization(user);
        document.location.reload();
    } else {
        onOtherResponse(this);
    }
}
