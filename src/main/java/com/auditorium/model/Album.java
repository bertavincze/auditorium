package com.auditorium.model;

import java.time.LocalDate;

public final class Album extends AbstractModel {

    private int userId;
    private String title;
    private String art;
    private int tracks;
    private boolean isPublic;
    private LocalDate datePublished;
    private int likes;

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

    public Album(int id, int userId, String title, String art, int tracks, boolean isPublic, int likes) {
        super(id);
        this.userId = userId;
        this.title = title;
        this.art = art;
        this.tracks = tracks;
        this.isPublic = isPublic;
        this.datePublished = null;
        this.likes = likes;
    }

    public Album() {}

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
