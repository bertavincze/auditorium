const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

let head;
let sortMenu;
let sidebar;
let menuButton;
let content;
let contentView;
let footer;

function hasAuthorization() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'login');
    xhr.send();
    if (xhr.status === OK) {
      return true;
    }
}

function setAuthorization(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function setUnauthorized() {
    localStorage.removeItem('user');
}

function newInfo(message) {
    newMessage('INFO', message);
}

function newError(message) {
    newMessage('ERROR', message);
}

function newMessage(level, message) {
    alert(level + ": " + message);
}

function onNetworkError(response) {
    document.body.remove();
    const bodyEl = document.createElement('body');
    document.appendChild(bodyEl);
    newError(bodyEl, 'Network error, please try reloading the page!');
}

function onOtherResponse(xhr) {
    if (xhr.status === NOT_FOUND) {
        newError('Not found');
        console.error(xhr);
    } else {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status === INTERNAL_SERVER_ERROR) {
            newError(`Server error: ${json.message}`);
        } else if (xhr.status === UNAUTHORIZED || xhr.status === BAD_REQUEST) {
            newError(json.message);
        } else {
            newError(`Unknown error: ${json.message}`);
        }
    }
}

function onLoad() {
    head = document.getElementById('head');
    sortMenu = document.getElementById('sort-menu');
    sidebar = document.getElementById('sidebar');
    menuButton = document.getElementById('menu-button');
    content = document.getElementById('content');
    contentView = document.getElementById('content-view-page');
    footer = document.getElementById('footer');

    loadAlbums();
    createMasonryDisplay();

    [document.body, head, sortMenu, content, contentView, footer].forEach(function(element) {
        element.addEventListener('click', onOtherElementClicked);
    });

    window.addEventListener('scroll', onScroll);
    window.addEventListener('load', createMasonryDisplay);
    menuButton.addEventListener('click', onMenuButtonClicked);

    [menuButton, sidebar].forEach(function(element) {
        element.onclick = function(event) {
            event.stopPropagation();
        };
    });

    [document.getElementById('head-sign-in'), document.getElementById('nav-sign-in')].forEach(function(element) {
        element.addEventListener('click', onSignInClicked);
        element.onclick = function(event) {
            event.stopPropagation();
        };
    });

    [document.getElementById('head-sign-up'), document.getElementById('nav-sign-up')].forEach(function(element) {
        element.addEventListener('click', onCreateAccountClicked);
        element.onclick = function(event) {
            event.stopPropagation();
        };
    });

    if (hasAuthorization()) {
        [document.getElementById('register-form'), document.getElementById('login-form')].forEach(function(element) {
            element.style.display = 'none';
        });
        document.getElementById('user-menu').style.display = 'block';
    } else {
        [document.getElementById('register-form'), document.getElementById('login-form')].forEach(function(element) {
            element.style.display = 'block';
        });
        document.getElementById('user-menu').style.display = 'none';
    }

}

function createMasonryDisplay() {
    content.style.display = 'block';
    imagesLoaded(content, { background: '.grid' }, function() {
        const elem = document.querySelector('.masonry');
        const masonry = new Masonry(elem, {
        fitWidth: true,
        isAnimated: true,
        itemSelector: '.grid',
        columnWidth: 90
        });
    });
}

function onMenuButtonClicked() {
    sidebar.style.right = 0;
    content.style.right = '300px';
    head.style.right = '300px';
    sortMenu.style.right = '300px';
    contentView.style.right = '300px';
    footer.style.right = '300px';
}

function onOtherElementClicked() {
    sidebar.style.right = '-300px';
    content.style.right = '0';
    head.style.right = '0';
    sortMenu.style.right = '0';
    contentView.style.right = '0';
    footer.style.right = '0';
}

function onSignInClicked() {
    if (sidebar.style.right != 0) {
        onMenuButtonClicked();
    }
    document.getElementById('login-input-email').focus();
}

function onCreateAccountClicked() {
    if (sidebar.style.right != 0) {
        onMenuButtonClicked();
    }
    document.getElementById('register-input-name').focus();
}

function onScroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('back-to-top-btn').style.display = 'inline-block';
    } else {
        document.getElementById('back-to-top-btn').style.display = 'none';
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

document.addEventListener('DOMContentLoaded', onLoad);