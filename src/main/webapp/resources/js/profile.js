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
        const pEl = document.createElement('p');
        pEl.textContent = 'Hover over an album for more options.';
        artistDivEl.appendChild(pEl);
        fetchAlbumsByUser(user);
        contentView.appendChild(artistDivEl);
    }
    
    const playlistDivEl = document.createElement('details');
    playlistDivEl.id = 'profile-playlists';
    const playlistTitle = document.createElement('summary');
    playlistTitle.textContent = 'My Playlists';
    playlistDivEl.appendChild(playlistTitle);
    //playlistDivEl.appendChild(createPlaylistsDisplay(user));
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

function fetchAlbumsByUser(user) {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('userId', user.id);
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const artistMenu = document.getElementById('artist-menu')
            artistMenu.appendChild(createArtistMenu(JSON.parse(this.responseText)));
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('GET', 'protected/artist?' + params.toString());
    xhr.send();
}

function createArtistMenu(albums) {
    const ulEl = document.createElement('ul');
    ulEl.className = 'album-thumbnails-small';
    
    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        const liEl = document.createElement('li');
        liEl.className = 'thumbnail-small-li';

        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-small';
        thumbnail.style = 'background: url(' + album.art + ')' + 'no-repeat; background-size: cover';

        const pEl = document.createElement('p');
        pEl.textContent = album.title;

        const thumbnailOverlay = document.createElement('div');
        thumbnailOverlay.className = 'thumbnail-small-overlay';

        const thumbnailOverlayButtons = document.createElement('div');
        thumbnailOverlayButtons.className = 'thumbnail-small-buttons';
        const viewAEl = document.createElement('a');
        viewAEl.innerHTML = '<i class="fa fa-eye"></i>';
        viewAEl.setAttribute('album-id', album.id);
        viewAEl.addEventListener('click', onExternalLinkClicked);
        thumbnailOverlayButtons.appendChild(viewAEl);
        const editAEl = document.createElement('a');
        editAEl.innerHTML = '<i class="fa fa-pencil"></i>';
        editAEl.setAttribute('album-id', album.id);
        editAEl.addEventListener('click', onEditAlbumClicked);
        thumbnailOverlayButtons.appendChild(editAEl);
        const deleteAEl = document.createElement('a');
        deleteAEl.innerHTML = '<i class="fa fa-trash-o"></i>';
        deleteAEl.setAttribute('album-id', album.id);
        deleteAEl.addEventListener('click', onDeleteAlbumClicked);
        thumbnailOverlayButtons.appendChild(deleteAEl);

        thumbnail.appendChild(thumbnailOverlay);
        thumbnailOverlay.appendChild(thumbnailOverlayButtons);
        thumbnailOverlay.appendChild(pEl);
        liEl.appendChild(thumbnail);
        
        ulEl.appendChild(liEl);
    }
    
    return ulEl;
}

function onEditAlbumClicked() {
    // TODO
}

function onDeleteAlbumClicked() {
    // TODO
}

function createPlaylistsDisplay(user) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const playlists = JSON.parse(this.responseText);
            
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('GET', 'protected/playlists');
    xhr.send();
}