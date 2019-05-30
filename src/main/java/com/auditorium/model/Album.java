package com.auditorium.model;

import java.time.LocalDate;

public final class Album extends AbstractModel {

    private final int userId;
    private final String title;
    private final String art;
    private final int tracks;
    private final boolean isPublic;
    private final LocalDate datePublished;
    private final int likes;

    public Album(int id, int userId, String title, String art, int tracks, boolean isPublic, LocalDate datePublished, int likes) {
        super(id);
        this.userId = userId;
        this.title = title;
        this.art = art;
        this.tracks = tracks;
        this.isPublic = isPublic;
        this.datePublished = datePublished;
        this.likes = likes;
    }

    public int getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getArt() {
        return art;
    }

    public int getTracks() {
        return tracks;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public int getLikes() {
        return likes;
    }

    public LocalDate getDatePublished() {
        return datePublished;
    }
}
