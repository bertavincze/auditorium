let timer;

function loadAlbums() {
    const params = new URLSearchParams();
    params.append('sort', 'none');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onAlbumsResponse);
    xhr.open('GET', 'albums?' + params.toString());
    xhr.send();
}

function loadNewestAlbums() {
    const params = new URLSearchParams();
    params.append('sort', 'date');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onAlbumsResponse);
    xhr.open('GET', 'albums?' + params.toString());
    xhr.send();
}

function loadMostLikedAlbums() {
    const params = new URLSearchParams();
    params.append('sort', 'likes');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onAlbumsResponse);
    xhr.open('GET', 'albums?' + params.toString());
    xhr.send();
}

function onAlbumsResponse() {
    if (this.status === OK) {
        const albumDtoList = JSON.parse(this.responseText);
        onAlbumsReceived(albumDtoList);
    } else {
        onOtherResponse(this);
    }
}

function onAlbumsReceived(albumDtoList) {
    removeAllChildren(content);

    [sortMenu, content].forEach(function(element) {
        showElementById(element);
    });

    for (let i = 0; i < albumDtoList.length; i++) {
        const albumDto = albumDtoList[i];
        const newBrickEl = document.createElement('div');
        newBrickEl.className = 'grid masonry-brick';
        newBrickEl.appendChild(createAlbumThumbnail(albumDto));
        newBrickEl.appendChild(createAlbumThumbnailButtons(albumDto));
        content.appendChild(newBrickEl);
    }
    createMasonryDisplay();
}

function createAlbumThumbnail(albumDto) {
    const thumbnailEl = document.createElement('div');
    thumbnailEl.className = 'thumbnail';
    thumbnailEl.setAttribute('id', albumDto.album.id);
    thumbnailEl.style = 'background: url(' + albumDto.album.art + ')' + 'no-repeat; background-size: cover';

    const overlayEl = document.createElement('div');
    overlayEl.className ='thumbnail-overlay';
    const pEl = document.createElement('p');
    pEl.innerHTML = albumDto.artist + '<br><br>' + albumDto.album.title;
    overlayEl.appendChild(pEl);

    thumbnailEl.appendChild(overlayEl);

    return thumbnailEl;
}

function createAlbumThumbnailButtons(albumDto) {
    const thumbnailFooterEl = document.createElement('div');
    thumbnailFooterEl.className = 'thumbnail-footer';

    const footerButtonsEl = document.createElement('div');
    footerButtonsEl.className = 'thumbnail-footer-buttons';

    const icons = ['fa fa-external-link', 'fa fa-play', 'fa fa-pause', 'fa fa-forward',
                        'fa fa-heart', 'fa fa-list-ul'];

    const functions = [onExternalLinkClicked, onPlayClicked, onPauseClicked, onForwardClicked, 
                      onLikeClicked, onAddToPlayListClicked];

    const ulEl = document.createElement('ul');
    for (let i = 0; i < icons.length; i++) {
        const liEl = document.createElement('li');
        const aEl = document.createElement('a');
        aEl.addEventListener('click', functions[i]);
        liEl.setAttribute('id', icons[i] + '-' + albumDto.album.id);
        aEl.setAttribute('album-id', albumDto.album.id);
        if (icons[i] === 'fa fa-heart') {
            if (albumDto.liked === true ) {
                aEl.classList.add('visited');
            }
        }
        const iconEl = document.createElement('i');
        iconEl.className = icons[i];
        if (icons[i] === 'fa fa-pause') {
            liEl.style.display = 'none';
        }
        aEl.appendChild(iconEl);
        liEl.appendChild(aEl);
        ulEl.appendChild(liEl);
    }

    footerButtonsEl.appendChild(ulEl);
    thumbnailFooterEl.appendChild(footerButtonsEl);
    return thumbnailFooterEl;
}

function onExternalLinkClicked() {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('albumId', this.getAttribute('album-id'));
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onAlbumResponse);
    xhr.open('GET', 'album?' + params.toString());
    xhr.send();
}

function onAlbumResponse() {
    if (this.status === OK) {
        const albumDto = JSON.parse(this.responseText);
        onAlbumReceived(albumDto);
    } else {
        onOtherResponse(this);
    }
}

function onAlbumReceived(albumDto) {
    removeAllChildren(content);
    removeAllChildren(contentView);
    [sortMenu, content].forEach(function(element) {
        hideElementById(element);
    });
    const albumDetailsDivEl = document.createElement('div');
    albumDetailsDivEl.setAttribute('id', 'album-details-view');
    albumDetailsDivEl.appendChild(createAlbumTableDisplay(albumDto));
    contentView.appendChild(albumDetailsDivEl);
    showElementById(contentView);
}

function createAlbumTableDisplay(albumDto) {
    const tableEl = document.createElement('table');
    tableEl.setAttribute('id', 'album-details-table');
    const trEl = document.createElement('tr');
    trEl.appendChild(createAlbumArtTdEl(albumDto));
    trEl.appendChild(createAlbumInfoTdEl(albumDto));
    tableEl.appendChild(trEl);
    return tableEl;
}

function createAlbumArtTdEl(albumDto) {
    const albumArtTdEl = document.createElement('td');
    const albumArtDivEl = document.createElement('div');
    albumArtDivEl.setAttribute('id', 'album-cover-full');
    albumArtDivEl.className = 'album-cover-full';
    albumArtDivEl.style = 'background: url(' + albumDto.album.art + ')' + 'no-repeat; background-size: cover';
    const albumArtOverlay = document.createElement('div');
    albumArtOverlay.setAttribute('id', 'album-cover-full-overlay');
    albumArtOverlay.className = 'album-cover-full-overlay';
    const pEl = document.createElement('p');
    pEl.innerHTML = albumDto.artist + '<br><br>' + albumDto.album.title;
    albumArtOverlay.appendChild(pEl);
    albumArtDivEl.appendChild(albumArtOverlay);
    albumArtTdEl.appendChild(albumArtDivEl);
    return albumArtTdEl;
}

function createAlbumInfoTdEl(albumDto) {
    const albumInfoTdEl = document.createElement('td');

    const artistEl = document.createElement('h2');
    artistEl.textContent = 'Artist';
    const artistPEl = document.createElement('p');
    artistPEl.className = 'album-info';
    artistPEl.textContent = albumDto.artist;
    albumInfoTdEl.appendChild(artistEl);
    albumInfoTdEl.appendChild(artistPEl);

    const titleEl = document.createElement('h2');
    titleEl.textContent = 'Title';
    const titlePEl = document.createElement('p');
    titlePEl.className = 'album-info';
    titlePEl.textContent = albumDto.album.title;
    albumInfoTdEl.appendChild(titleEl);
    albumInfoTdEl.appendChild(titlePEl);

    const dateTitleEl = document.createElement('h2');
    dateTitleEl.textContent = 'Release date';
    const datePEl = document.createElement('p');
    datePEl.className = 'album-info';
    if (albumDto.album.public === true) {
        datePEl.textContent = albumDto.album.datePublished.dayOfMonth + ' ' + albumDto.album.datePublished.month + ', ' + albumDto.album.datePublished.year;
    } else {
        datePEl.textContent = 'Not released yet.'
    }
    albumInfoTdEl.appendChild(dateTitleEl);
    albumInfoTdEl.appendChild(datePEl);

    const tracklistTitleEl = document.createElement('h2');
    tracklistTitleEl.textContent = 'Tracklist';
    const tracklistEl = document.createElement('ol');
    tracklistEl.className = 'tracklist';

    for (let i = 0; i < albumDto.tracks.length; i++) {
        const track = albumDto.tracks[i];
        const liEl = document.createElement('li');
        liEl.textContent = track.title + ' - ' + track.duration.minute + ':' + track.duration.second;
        tracklistEl.appendChild(liEl);
    }

    albumInfoTdEl.appendChild(tracklistTitleEl);
    albumInfoTdEl.appendChild(tracklistEl);
    return albumInfoTdEl;
}

function onPlayClicked() {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('albumId', this.getAttribute('album-id'));
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onPlayedAlbumResponse);
    xhr.open('GET', 'album?' + params.toString());
    xhr.send();
}

function onPlayedAlbumResponse() {
    if (this.status === OK) {
        const albumDto = JSON.parse(this.responseText);
        playAlbum(albumDto, 0);
    } else {
        onOtherResponse(this);
    }
}

function playAlbum(albumDto, trackIndex) {
    hideElementById(getPlayButtonByAlbum(albumDto.album.id));
    showInlineElementById(getPauseButtonByAlbum(albumDto.album.id));
    
    const pEl = document.createElement('p');
    removeAllChildren(nowPlaying);
    nowPlaying.appendChild(pEl);
    showElementById(nowPlaying);

    (function playTrack() {
        if (trackIndex < albumDto.tracks.length) {
            setCurrentTrack(albumDto.tracks[trackIndex]);
            pEl.textContent = 'Now playing - ' + albumDto.artist + ' - ' + albumDto.tracks[trackIndex].title +
            ' - Album: ' + albumDto.album.title;
            timer = setTimeout(playTrack, parseInt(albumDto.tracks[trackIndex].duration.second) * 1000);
            trackIndex++;
        } else {
            clearTimeout(timer);
            removeCurrentTrack();
            removeAllChildren(nowPlaying);
            hideElementById(nowPlaying);
            hideElementById(getPauseButtonByAlbum(albumDto.album.id));
            showInlineElementById(getPlayButtonByAlbum(albumDto.album.id));
        }
    })();
}

function getPlayButtonByAlbum(albumId) {
    return document.getElementById('fa fa-play' + '-' + albumId);
}

function getPauseButtonByAlbum(albumId) {
    return document.getElementById('fa fa-pause' + '-' + albumId);
}

function getCurrentTrack() {
    return JSON.parse(localStorage.getItem('current-track'));
}

function setCurrentTrack(track) {
    localStorage.setItem('current-track', JSON.stringify(track));
}

function removeCurrentTrack() {
    localStorage.removeItem('current-track');
}

function onPauseClicked() {
    if (getCurrentTrack() != null) {
        clearTimeout(timer);
        removeCurrentTrack();
        removeAllChildren(nowPlaying);
        hideElementById(nowPlaying);
        hideElementById(getPauseButtonByAlbum(this.getAttribute('album-id')));
        showInlineElementById(getPlayButtonByAlbum(this.getAttribute('album-id')));
    }
}

function onForwardClicked() {
    clearTimeout(timer);
    const track = getCurrentTrack();
    if (track != null && track.albumId == this.getAttribute('album-id')) {
        const xhr = new XMLHttpRequest();
        const params = new URLSearchParams();
        params.append('albumId', this.getAttribute('album-id'));
        xhr.addEventListener('error', onNetworkError);
        xhr.addEventListener('load', onForwardResponse);
        xhr.open('GET', 'album?' + params.toString());
        xhr.send();
    }
}

function onForwardResponse() {
    if (this.status === OK) {
        const albumDto = JSON.parse(this.responseText);
        for (let i = 0; i < albumDto.tracks.length; i++) {
            const track = albumDto.tracks[i];
            if (track.id == getCurrentTrack().id) {
                playAlbum(albumDto, ++i);
                break;
            }
        }
    } else {
        onOtherResponse(this);
    }
}

function onLikeClicked() {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('albumId', this.getAttribute('album-id'));
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onAlbumLikedResponse);
    xhr.open('POST', 'protected/like');
    xhr.send(params);
}

function onAlbumLikedResponse() {
    if (this.status === OK) {
        const albumId = JSON.parse(this.responseText);
        const likeAEl = document.getElementById('fa fa-heart-' + albumId).firstChild;
        likeAEl.classList.add('visited');
    } else {
        onOtherResponse(this);
    }
}

function onAddToPlayListClicked() {
    const albumId = this.getAttribute('album-id');
    const coordinates = [event.pageX, event.pageY];

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            const playlists = JSON.parse(this.responseText);
            createPlaylistsPopup(playlists, coordinates, albumId);
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('GET', 'protected/playlists');
    xhr.send();
}

function createPlaylistsPopup(playlists, coordinates, albumId) {
    const playlistsDivEl = document.createElement('div');
    playlistsDivEl.setAttribute('id', 'playlists-view');
    playlistsDivEl.className = 'modal';
    playlistsDivEl.style.left = coordinates[0] + 'px';
    playlistsDivEl.style.top = coordinates[1] + 'px';

    const closeButton = document.createElement('a');
    closeButton.className = 'close-modal';
    closeButton.addEventListener('click', onModalCloseClicked);
    closeButton.innerHTML = '<i class="fa fa-times"></i>';
    playlistsDivEl.appendChild(closeButton);

    const pEl = document.createElement('p');
    pEl.innerHTML = 'Add to playlist: <br>';
    playlistsDivEl.appendChild(pEl);
    
    const ulEl = document.createElement('ul');
    
    for (let i = 0; i < playlists.length; i++) {
        const playlist = playlists[i];
        const liEl = document.createElement('li');
        const aEl = document.createElement('a');
        aEl.textContent = playlist.title;
        aEl.setAttribute('playlist-id', playlist.id);
        aEl.setAttribute('album-id', albumId);
        aEl.addEventListener('click', onPlaylistTitleClicked);
        liEl.appendChild(aEl);
        ulEl.appendChild(liEl);
    }

    playlistsDivEl.appendChild(ulEl);
    document.body.appendChild(playlistsDivEl);
    playlistsDivEl.classList.toggle('active');
}

function onModalCloseClicked() {
    const playlistsDivEl = document.getElementById('playlists-view');
    playlistsDivEl.classList.remove('active');
    playlistsDivEl.remove();
}

function onPlaylistTitleClicked() {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('albumId', this.getAttribute('album-id'));
    params.append('playlistId', this.getAttribute('playlist-id'));
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', function() {
        if (this.status === OK) {
            alert('Album added to playlist.');
            onModalCloseClicked();
        } else {
            onOtherResponse(this);
        }
    });
    xhr.open('POST', 'protected/playlist');
    xhr.send(params);
}
