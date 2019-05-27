package com.auditorium.model;

public final class Track extends AbstractModel {

    private final String title;
    private final int duration;
    private final int albumId;

    public Track(int id, String title, int duration, int albumId) {
        super(id);
        this.title = title;
        this.duration = duration;
        this.albumId = albumId;
    }

    public String getTitle() {
        return title;
    }

    public int getDuration() {
        return duration;
    }

    public int getAlbumId() {
        return albumId;
    }
}
