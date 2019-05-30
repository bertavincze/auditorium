package com.auditorium.model;

import java.time.LocalTime;

public final class Track extends AbstractModel {

    private final String title;
    private final LocalTime duration;
    private final int albumId;

    public Track(int id, String title, LocalTime duration, int albumId) {
        super(id);
        this.title = title;
        this.duration = duration;
        this.albumId = albumId;
    }

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
