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
    fetchPlaylistsByUser(user);
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
            const artistMenu = document.getElementById('artist-menu');
            artistMenu.appendChild(createArtistMenu(JSON.parse(this.responseText)));
            const albumPEl = document.createElement('p');
            const albumAEl = document.createElement('a');
            albumAEl.textContent = 'Click here to upload a new album.';
            albumAEl.addEventListener('click', onAddNewAlbumClicked);
            albumPEl.appendChild(albumAEl);
            artistMenu.appendChild(albumPEl);
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

function onAddNewAlbumClicked() {
    removeAllChildren(contentView);
    const albumCreateDiv = document.createElement('div');
    albumCreateDiv.id = 'album-create-div';

    const formEl = document.createElement('form');
    formEl.id = 'album-create-form';
    formEl.setAttribute('onsubmit', 'return false;');

    const title = document.createElement('h2');
    title.textContent = 'Add new album';
    formEl.appendChild(title);

    const albumAttr = ['Title', 'Cover art (URL)', 'Number of tracks (1-12)'];

    const ul = document.createElement('ul');

    for (let i = 0; i < albumAttr.length; i++) {
        const li = document.createElement('li');
        const attr = albumAttr[i];
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'album-create-input';
        input.name = attr.toLowerCase();
        input.placeholder = attr;
        input.required = true;
        if (attr == 'Number of tracks (1-12)') {
            input.type = 'number';
            input.max = 12;
            input.min = 1;
        }
        li.appendChild(input);
        ul.appendChild(li);
    }

    const li = document.createElement('li');
    const select = document.createElement('select');
    select.className = 'album-create-select';
    select.name = 'visibility';
    select.required = true;
    const private = document.createElement('option');
    private.textContent = 'Private';
    private.value = false;
    const public = document.createElement('option');
    public.textContent = 'Public';
    public.value = true;
    select.appendChild(private);
    select.appendChild(public);
    li.appendChild(select);
    ul.appendChild(li);

    const liLast = document.createElement('li');
    const submitEl = document.createElement('input');
    submitEl.type = 'submit';
    submitEl.className = 'album-create-submit';
    submitEl.value = 'Submit';
    submitEl.addEventListener('click', onAddNewAlbumSubmitClicked)
    liLast.appendChild(submitEl);
    ul.appendChild(liLast);

    formEl.appendChild(ul);
    albumCreateDiv.appendChild(formEl);
    contentView.appendChild(albumCreateDiv);
}

function onAddNewAlbumSubmitClicked() {
    const albumFormEl = document.forms['album-create-form'];

    const titleInputEl = albumFormEl.querySelector('input[name="title"]');
    const artInputEl = albumFormEl.querySelector('input[name="cover art (url)"]');
    const tracksInputEl = albumFormEl.querySelector('input[name="number of tracks (1-12)"]');
    const visibilitySelectEl = albumFormEl.querySelector('select[name="visibility"]');

    const title = titleInputEl.value;
    const art = artInputEl.value;
    const tracks = tracksInputEl.value;
    const visibility = visibilitySelectEl.value;

    const params = new URLSearchParams();
    params.append('userId', getCurrentUser().id);
    params.append('title', title);
    params.append('art', art);
    params.append('tracks', tracks);
    params.append('isPublic', visibility);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumSubmitResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'album');
    xhr.send(params);
}

function onAlbumSubmitResponse() {
    if (this.status === OK) {
        const album = JSON.parse(this.responseText);
        addTracksToAlbum(album);
    } else {
        onOtherResponse(this);
    }
}

function addTracksToAlbum(album) {
    const albumCreateDiv = document.getElementById('album-create-div');
    removeAllChildren(albumCreateDiv);

    const formEl = document.createElement('form');
    formEl.id = 'album-create-form';
    formEl.setAttribute('onsubmit', 'return false;');

    const title = document.createElement('h2');
    title.textContent = 'Add tracks to the album';
    formEl.appendChild(title);

    const ul = document.createElement('ul');

    for (let i = 0; i < album.tracks; i++) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'album-create-input';
        input.name = 'track-title';
        input.placeholder = 'Track ' + parseInt(i + 1)  + ' title';
        input.required = true;
        li.appendChild(input);
        ul.appendChild(li);
    }

    const liLast = document.createElement('li');
    const submitEl = document.createElement('input');
    submitEl.type = 'submit';
    submitEl.className = 'album-create-submit';
    submitEl.value = 'Save';
    submitEl.setAttribute('album-id', album.id);
    submitEl.addEventListener('click', onAddTrackSubmitClicked)
    liLast.appendChild(submitEl);
    ul.appendChild(liLast);

    formEl.appendChild(ul);
    albumCreateDiv.appendChild(formEl);
}

function onAddTrackSubmitClicked() {
    const albumFormEl = document.forms['album-create-form'];

    const titles = [];
    albumFormEl.querySelectorAll('input[name="track-title"]').forEach(function(element) {
        titles.push(element.value);
    });

    const params = new URLSearchParams();
    params.append('titles', titles);
    params.append('albumId', this.getAttribute('album-id'));

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAddTrackSubmitResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'protected/track');
    xhr.send(params);
}

function onAddTrackSubmitResponse() {
    if (this.status === OK) {
        onProfileClicked();
        document.getElementById('artist-menu').toggleAttribute('open');
    } else {
        onOtherResponse(this);
    }
}

function onEditAlbumClicked() {
    const params = new URLSearchParams();
    params.append('albumId', this.getAttribute('album-id'));

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onEditAlbumResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'album?' + params.toString());
    xhr.send();
}

function onEditAlbumResponse() {
    if (this.status === OK) {
        const albumDto = JSON.parse(this.responseText);
        createAlbumEditDiv(albumDto);
    } else {
        onOtherResponse(this);
    }
}

function createAlbumEditDiv(albumDto) {
    removeAllChildren(contentView);
    const albumEditDiv = document.createElement('div');
    albumEditDiv.id = 'album-edit-div';

    const formEl = document.createElement('form');
    formEl.id = 'album-create-form';
    formEl.setAttribute('onsubmit', 'return false;');

    const title = document.createElement('h2');
    title.textContent = 'Edit album';
    formEl.appendChild(title);

    const albumAttr = ['Title', 'Cover art (URL)'];
    const albumDtoAttr = [albumDto.album.title, albumDto.album.art];

    const ul = document.createElement('ul');

    for (let i = 0; i < albumAttr.length; i++) {
        const li = document.createElement('li');
        const attr = albumAttr[i];
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'album-create-input';
        input.name = attr.toLowerCase();
        input.placeholder = attr;
        input.required = true;
        input.value = albumDtoAttr[i];
        li.appendChild(input);
        ul.appendChild(li);
    }

    const li = document.createElement('li');
    const select = document.createElement('select');
    select.className = 'album-create-select';
    select.name = 'visibility';
    select.required = true;
    const private = document.createElement('option');
    private.textContent = 'Private';
    private.value = false;
    const public = document.createElement('option');
    public.textContent = 'Public';
    public.value = true;
    if (albumDto.album.public === true) {
        public.toggleAttribute('selected');
    } else {
        private.toggleAttribute('selected');
    }
    select.appendChild(private);
    select.appendChild(public);
    li.appendChild(select);
    ul.appendChild(li);

    const liLast = document.createElement('li');
    const submitEl = document.createElement('input');
    submitEl.type = 'submit';
    submitEl.className = 'album-create-submit';
    submitEl.value = 'Save';
    submitEl.setAttribute('album-id', albumDto.album.id);
    submitEl.addEventListener('click', onEditAlbumSubmitClicked)
    liLast.appendChild(submitEl);
    ul.appendChild(liLast);

    formEl.appendChild(ul);
    albumEditDiv.appendChild(formEl);
    contentView.appendChild(albumEditDiv);
}

function onEditAlbumSubmitClicked() {
    const albumFormEl = document.forms['album-create-form'];

    const titleInputEl = albumFormEl.querySelector('input[name="title"]');
    const artInputEl = albumFormEl.querySelector('input[name="cover art (url)"]');
    const visibilitySelectEl = albumFormEl.querySelector('select[name="visibility"]');

    const title = titleInputEl.value;
    const art = artInputEl.value;
    const visibility = visibilitySelectEl.value;

    const params = new URLSearchParams();
    params.append('albumId', this.getAttribute('album-id'));
    params.append('title', title);
    params.append('art', art);
    params.append('isPublic', visibility);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            onProfileClicked();
            document.getElementById('artist-menu').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'album?' + params.toString());
    xhr.send();
}

function onDeleteAlbumClicked() {
    const userResponse = confirm('Press OK to confirm.');
    if (userResponse == true) {
        const xhr = new XMLHttpRequest();
        const params = new URLSearchParams();
        const id = this.getAttribute('album-id');
        params.append('albumId', id);
        xhr.addEventListener('error', onNetworkError);
        xhr.addEventListener('load', function() {
        if (this.status === OK) {
            onProfileClicked();
            document.getElementById('artist-menu').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('DELETE', 'album?' + params.toString());
    xhr.send();
    } 
}

function fetchPlaylistsByUser(user) {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('userId', user.id);
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const playlists = JSON.parse(this.responseText);
            const playlistsDiv = document.getElementById('profile-playlists');
            playlistsDiv.appendChild(createPlaylistsDisplay(playlists));
            const playlistPEl = document.createElement('p');
            const playlistAEl = document.createElement('a');
            playlistAEl.textContent = 'Click here to create a new playlist.';
            playlistAEl.addEventListener('click', onAddNewPlaylistClicked);
            playlistPEl.appendChild(playlistAEl);
            playlistsDiv.appendChild(playlistPEl);
            
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('GET', 'protected/playlists?' + params.toString());
    xhr.send();
}

function createPlaylistsDisplay(playlists) {
    const tableEl = document.createElement('table');
    tableEl.id = 'profile-playlists-table';

    for (let i = 0; i < playlists.length; i++) {
        const playlist = playlists[i];
        const trEl = document.createElement('tr');
        trEl.id = 'playlist-tr-' + playlist.id;

        const titleHTdEl = document.createElement('td');
        titleHTdEl.textContent = 'Title: ';
        trEl.appendChild(titleHTdEl);

        const titleTdEl = document.createElement('td');
        titleTdEl.id = 'playlist-title-' + playlist.id;
        titleTdEl.textContent = playlist.title;
        trEl.appendChild(titleTdEl);

        const editTdEl = document.createElement('td');
        const editAEl = document.createElement('a');
        editAEl.setAttribute('playlist-id', playlist.id);
        editAEl.addEventListener('click', onEditPlaylistClicked);
        editAEl.innerHTML = '<i class="fa fa-edit"></i>';
        editTdEl.appendChild(editAEl);
        trEl.appendChild(editTdEl);

        const deleteTdEl = document.createElement('td');
        const deleteAEl = document.createElement('a');
        deleteAEl.setAttribute('playlist-id', playlist.id);
        deleteAEl.addEventListener('click', onDeletePlaylistClicked);
        deleteAEl.innerHTML = '<i class="fa fa-trash-o"></i>';
        deleteTdEl.appendChild(deleteAEl);
        trEl.appendChild(deleteTdEl);

        tableEl.appendChild(trEl);
        
    }
    return tableEl;
}

function onAddNewPlaylistClicked() {
    const tableEl = document.getElementById('profile-playlists-table');
    const newRow = tableEl.insertRow(-1);
    const titleHTdEl = newRow.insertCell(0);
    titleHTdEl.textContent = 'Title: '
    const titleTdEl = newRow.insertCell(1);
    titleTdEl.id = 'new-playlist-title';
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.placeholder = 'Enter a title for the playlist'
    inputEl.className = 'profile-input';
    titleTdEl.appendChild(inputEl);
    const addTdEl = newRow.insertCell(2);
    const addAEl = document.createElement('a');
    addAEl.innerHTML = '<i class="fa fa-plus"></i>'
    addAEl.addEventListener('click', onAddPlaylistButtonClicked);
    addTdEl.appendChild(addAEl);
    const cancelTdEl = newRow.insertCell(3);
    const cancelAEl = document.createElement('a');
    cancelAEl.innerHTML = '<i class="fa fa-times"></i>'
    cancelAEl.addEventListener('click', onCancelAddPlaylistButtonClicked);
    cancelTdEl.appendChild(cancelAEl);
}

function onAddPlaylistButtonClicked() {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    
    if (document.getElementById('new-playlist-title').firstChild.value) {
        params.append('userId', getCurrentUser().id);
        params.append('title', document.getElementById('new-playlist-title').firstChild.value);

        xhr.addEventListener('error', onNetworkError);
        xhr.addEventListener('load', function() {
            if (this.status === OK) {
                onProfileClicked();
                document.getElementById('profile-playlists').toggleAttribute('open');
            } else {
                onOtherResponse(this);
            }
        });
        
        xhr.open('POST', 'protected/playlists?' + params.toString());
        xhr.send();
    } 
}

function onCancelAddPlaylistButtonClicked() {
    const tableEl = document.getElementById('profile-playlists-table');
    tableEl.deleteRow(-1);
}

function onEditPlaylistClicked() {
    this.innerHTML = '<i class="fa fa-save"></i>';
    this.removeEventListener('click', onEditPlaylistClicked);
    this.addEventListener('click', onSavePlaylistClicked);
    const titleTdEl = document.getElementById('playlist-title-' + this.getAttribute('playlist-id'));
    titleTdEl.textContent = '';
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'profile-input';
    titleTdEl.appendChild(inputEl);
}

function onSavePlaylistClicked() {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    const id = this.getAttribute('playlist-id');
    
    if (document.getElementById('playlist-title-' + id).firstChild.value) {
        params.append('playlistId', id);
        params.append('title', document.getElementById('playlist-title-' + id).firstChild.value);
    } 

    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            onProfileClicked();
            document.getElementById('profile-playlists').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });
    
    xhr.open('PUT', 'protected/playlist?' + params.toString());
    xhr.send();
}

function onDeletePlaylistClicked() {
    const userResponse = confirm('Press OK to confirm.');
    if (userResponse == true) {
        const xhr = new XMLHttpRequest();
        const params = new URLSearchParams();
        const id = this.getAttribute('playlist-id');
        params.append('playlistId', id);
        xhr.addEventListener('error', onNetworkError);
        xhr.addEventListener('load', function() {
        if (this.status === OK) {
            onProfileClicked();
            document.getElementById('profile-playlists').toggleAttribute('open');
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('DELETE', 'protected/playlists?' + params.toString());
    xhr.send();
    } 
}