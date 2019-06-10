function onProfileClicked() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onProfileResponse);
    xhr.open('GET', 'protected/profile');
    xhr.send();
}

function onProfileResponse() {
    if (this.status === OK) {
        const user = JSON.parse(this.responseText);
        createProfileDisplay(user);
    } else {
        onOtherResponse(this);
    }
}

function createProfileDisplay(user) {
    removeAllChildren(content);
    removeAllChildren(contentView);
    [sortMenu, content].forEach(function(element) {
        hideElementById(element);
    });
    
    const profileDivEl = document.createElement('details');
    profileDivEl.id = 'profile-view';
    const detailsTitle = document.createElement('summary');
    detailsTitle.textContent = 'Profile Details';
    
    profileDivEl.appendChild(detailsTitle); 
    profileDivEl.appendChild(createProfileTable(user));
    contentView.appendChild(profileDivEl);

    if (user.role === 'artist') {
        const artistDivEl = document.createElement('details');
        artistDivEl.id = 'artist-menu';
        const artistTitle = document.createElement('summary');
        artistTitle.textContent = 'Artist Menu';
        artistDivEl.appendChild(artistTitle);
        //artistDivEl.appendChild(createArtistMenu(user));
        contentView.appendChild(artistDivEl);
    }
    
    const playlistDivEl = document.createElement('details');
    playlistDivEl.id = 'profile-playlists';
    const playlistTitle = document.createElement('summary');
    playlistTitle.textContent = 'My Playlists';
    playlistDivEl.appendChild(playlistTitle);
    //playlistDivEl.appendChild(createPlaylistsTable(user));
    contentView.appendChild(playlistDivEl);

}

function createProfileTable(user) {
    const tableEl = document.createElement('table');

    const trOneEl = document.createElement('tr');
    trOneEl.id = 'profile-name-tr';
    const nameHTdEl = document.createElement('td');
    nameHTdEl.textContent = 'Name: ';
    const nameTdEl = document.createElement('td');
    nameTdEl.id = 'profile-name-td';
    nameTdEl.textContent = user.name;

    const nameEditTdEl = document.createElement('td');
    const nameEditAEl = document.createElement('a');
    nameEditAEl.addEventListener('click', onEditNameClicked);
    nameEditAEl.innerHTML = '<i class="fa fa-edit"></i>';
    nameEditTdEl.appendChild(nameEditAEl);

    [nameHTdEl, nameTdEl, nameEditTdEl].forEach(function(element) {
        trOneEl.appendChild(element);
    })

    const trTwoEl = document.createElement('tr');
    trTwoEl.id = 'profile-email-tr';
    const emailHTdEl = document.createElement('td');
    emailHTdEl.textContent = 'Email: ';
    const emailTdEl = document.createElement('td');
    emailTdEl.id = 'profile-email-td';
    emailTdEl.textContent = user.email;

    const emailEditTdEl = document.createElement('td');
    const emailEditAEl = document.createElement('a');
    emailEditAEl.addEventListener('click', onEditEmailClicked);
    emailEditAEl.innerHTML = '<i class="fa fa-edit"></i>';
    emailEditTdEl.appendChild(emailEditAEl);

    [emailHTdEl, emailTdEl, emailEditTdEl].forEach(function(element) {
        trTwoEl.appendChild(element);
    })

    const trThreeEl = document.createElement('tr');
    trThreeEl.id = 'profile-password-tr';
    const passwordHTdEl = document.createElement('td');
    passwordHTdEl.textContent = 'Password: ';
    const passwordTdEl = document.createElement('td');
    passwordTdEl.id = 'profile-password-td';
    passwordTdEl.textContent = '*****';

    const passwordEditTdEl = document.createElement('td');
    const passwordEditAEl = document.createElement('a');
    passwordEditAEl.addEventListener('click', onEditPasswordClicked);
    passwordEditAEl.innerHTML = '<i class="fa fa-edit"></i>';
    passwordEditTdEl.appendChild(passwordEditAEl);

    [passwordHTdEl, passwordTdEl, passwordEditTdEl].forEach(function(element) {
        trThreeEl.appendChild(element);
    });

    [trOneEl, trTwoEl, trThreeEl].forEach(function(element) {
        tableEl.appendChild(element);
    });
    
    return tableEl;
}

function onEditNameClicked() {
    this.innerHTML = '<i class="fa fa-save"></i>';
    this.removeEventListener('click', onEditNameClicked);
    this.addEventListener('click', onSaveNameClicked);
    const nameTdEl = document.getElementById('profile-name-td');
    nameTdEl.textContent = '';
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'profile-input';
    nameTdEl.appendChild(inputEl);
}

function onSaveNameClicked() {
    debugger;
    const xhr = new XMLHttpRequest();
    const user = getCurrentUser();
    const data = {};

    data.id = user.id;
    if (document.getElementById('profile-name-td').firstChild.value) {
        data.name = document.getElementById('profile-name-td').firstChild.value;
    } else {
        data.name = user.name;
    }
    data.email = user.email;
    data.password = user.password;
    data.role = user.role;

    const json = JSON.stringify(data);

    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const user = JSON.parse(this.responseText);
            checkAuth();
            createProfileDisplay(user);
            document.getElementById('profile-view').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });

    xhr.open('PUT', 'protected/profile');
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}

function onEditEmailClicked() {
    this.innerHTML = '<i class="fa fa-save"></i>';
    this.removeEventListener('click', onEditEmailClicked);
    this.addEventListener('click', onSaveEmailClicked);
    const emailTdEl = document.getElementById('profile-email-td');
    emailTdEl.textContent = '';
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'profile-input';
    emailTdEl.appendChild(inputEl);
}

function onSaveEmailClicked() {
    const xhr = new XMLHttpRequest();
    const user = getCurrentUser();
    const data = {};

    data.id = user.id;
	data.name = user.name;	
    if (document.getElementById('profile-email-td').firstChild.value) {
        data.email = document.getElementById('profile-email-td').firstChild.value;
    } else {
        data.email = user.email;
    }
    data.password = user.password;
    data.role = user.role;

    const json = JSON.stringify(data);

    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const user = JSON.parse(this.responseText);
            checkAuth();
            createProfileDisplay(user);
            document.getElementById('profile-view').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });
    
    xhr.open('PUT', 'protected/profile');
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}

function onEditPasswordClicked() {
    this.innerHTML = '<i class="fa fa-save"></i>';
    this.removeEventListener('click', onEditPasswordClicked);
    this.addEventListener('click', onSavePasswordClicked);
    const passwordTdEl = document.getElementById('profile-password-td');
    passwordTdEl.textContent = '';
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'profile-input';
    passwordTdEl.appendChild(inputEl);
}

function onSavePasswordClicked() {
    const xhr = new XMLHttpRequest();
    const user = getCurrentUser();
    const data = {};

    data.id = user.id;
	data.name = user.name;	
    data.email = user.email;
    if (document.getElementById('profile-password-td').firstChild.value) {
        data.password = document.getElementById('profile-password-td').firstChild.value;
    } else {
        data.password = user.password;
    }
    data.role = user.role;

    const json = JSON.stringify(data);

    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const user = JSON.parse(this.responseText);
            checkAuth();
            createProfileDisplay(user);
            document.getElementById('profile-view').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });
    
    xhr.open('PUT', 'protected/profile');
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}

function createArtistMenu(user) {
    // const xhr = new XMLHttpRequest();
    // xhr.addEventListener('error', onNetworkError);
    // xhr.addEventListener('load', function() {
    //     if (this.status === OK) {
    //         const playlists = JSON.parse(this.responseText);
    //         createPlaylistsDisplay(playlists, coordinates, albumId);
    //     } else {
    //         onOtherResponse(this);
    //     }
    // });
    // xhr.open('GET', 'protected/playlists');
    // xhr.send();
}

function createPlaylistsTable(user) {
    // TODO
}