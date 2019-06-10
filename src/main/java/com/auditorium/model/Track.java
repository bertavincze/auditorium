package com.auditorium.model;

import java.time.LocalTime;

public final class Track extends AbstractModel {

    private String title;
    private LocalTime duration;
    private int albumId;

    public Track(int id, String title, LocalTime duration, int albumId) {
        super(id);
        this.title = title;
        this.duration = duration;
        this.albumId = albumId;
    }

    public Track() {}

    public String getTitle() {
        return title;
    }

    public LocalTime getDuration() {
        return duration;
    }

    public int getAlbumId() {
        return albumId;
    }
}
