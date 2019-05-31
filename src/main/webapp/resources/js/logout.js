function onLogoutClicked() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLogoutResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/logout');
    xhr.send();
}

function onLogoutResponse() {
    if (this.status === OK) {
        setUnauthorized();
        const response = JSON.parse(this.responseText);
        alert(response.message);
        document.location.reload();
    } else {
        onOtherResponse(this);
    }
}