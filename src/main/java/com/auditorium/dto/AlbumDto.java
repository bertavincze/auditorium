package com.auditorium.dto;

import com.auditorium.model.Album;
import com.auditorium.model.Track;

import java.util.List;

public final class AlbumDto {

    private final String artist;
    private final Album album;
    private final List<Track> tracks;
    private boolean isLiked;

    public AlbumDto(String artist, Album album, List<Track> tracks) {
        this.artist = artist;
        this.album = album;
        this.tracks = tracks;
        this.isLiked = false;
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

    public boolean isLiked() {
        return isLiked;
    }

    public void setLiked(boolean liked) {
        isLiked = liked;
    }
}
