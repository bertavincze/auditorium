package com.auditorium.dto;

import com.auditorium.model.Album;
import com.auditorium.model.Track;

import java.util.List;

public final class AlbumDto {

    private final String artist;
    private final Album album;
    private final List<Track> tracks;

    public AlbumDto(String artist, Album album, List<Track> tracks) {
        this.artist = artist;
        this.album = album;
        this.tracks = tracks;
    }

    public String getArtist() {
        return artist;
    }

    public Album getAlbum() {
        return album;
    }

    public List<Track> getTracks() {
        return tracks;
    }
}
