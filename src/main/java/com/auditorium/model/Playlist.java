package com.auditorium.model;

public final class Playlist extends AbstractModel {

    private String title;
    private int userId;

    public Playlist(int id, String title, int userId) {
        super(id);
        this.title = title;
        this.userId = userId;
    }

    public Playlist() {}

    public String getTitle() {
        return title;
    }

    public int getUserId() {
        return userId;
    }
}
