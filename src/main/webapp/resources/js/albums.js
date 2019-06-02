function loadAlbums() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', onNetworkError);
    xhr.addEventListener('load', onAlbumsResponse);
    xhr.open('GET', 'albums');
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

    const icons = ['fa fa-external-link', 'fa fa-play', 'fa fa-fast-forward',
                        'fa fa-heart', 'fa fa-list-ul', 'fa fa-facebook', 'fa fa-twitter'];

    const functions = [onExternalLinkClicked, onPlayClicked, onFastForwardClicked, 
                      onLikeClicked, onFavListClicked, onFacebookClicked, onTwitterClicked];

    const ulEl = document.createElement('ul');

    for (let i = 0; i < icons.length; i++) {
        const liEl = document.createElement('li');
        const aEl = document.createElement('a');
        aEl.href = 'javascript:void(0)';
        aEl.addEventListener('click', functions[i]);
        aEl.setAttribute('id', albumDto.album.id);
        const iconEl = document.createElement('i');
        iconEl.className = icons[i];
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
    params.append('albumId', this.id);
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
    datePEl.textContent = albumDto.album.datePublished.dayOfMonth + ' ' + albumDto.album.datePublished.month + ', ' + albumDto.album.datePublished.year;
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
    // TODO
}

function onFastForwardClicked() {
    // TODO
}

function onLikeClicked() {
    // TODO
}

function onFavListClicked() {
    // TODO
}

function onFacebookClicked() {
    // TODO
}

function onTwitterClicked() {
    // TODO
}