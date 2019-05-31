function loadAlbums() {
    content.style.display = 'none';
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
    for (let i = 0; i < albumDtoList.length; i++) {
        const albumDto = albumDtoList[i];
        const newBrickEl = document.createElement('div');
        newBrickEl.className = 'grid masonry-brick';
        newBrickEl.appendChild(createAlbumThumbnail(albumDto));
        newBrickEl.appendChild(createAlbumThumbnailButtons(albumDto));
        content.appendChild(newBrickEl);
    }
}

function createAlbumThumbnail(albumDto) {
    const thumbnailEl = document.createElement('div');
    thumbnailEl.className = 'thumbnail';
    thumbnailEl.setAttribute('id', albumDto.album.id);
    thumbnailEl.style = 'background: url(' + albumDto.album.art + ')' + 'no-repeat; background-size: cover';

    const overlayEl = document.createElement('div');
    overlayEl.className ='thumbnail-overlay';
    const pEl = document.createElement('p');
    const brEl = document.createElement('br');
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

    const ulEl = document.createElement('ul');

    for (let i = 0; i < icons.length; i++) {
        const liEl = document.createElement('li');
        const aEl = document.createElement('a');
        aEl.href = 'javascript:void(0)';
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