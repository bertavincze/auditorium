package com.auditorium.dto;

import com.auditorium.model.Playlist;

import java.util.List;

public class PlaylistDto {

    private final Playlist playlist;
    private final List<AlbumDto> albums;

    public PlaylistDto(Playlist playlist, List<AlbumDto> albums) {
        this.playlist = playlist;
        this.albums = albums;
    }

    public Playlist getPlaylist() {
        return playlist;
    }

    public List<AlbumDto> getAlbums() {
        return albums;
    }
}
