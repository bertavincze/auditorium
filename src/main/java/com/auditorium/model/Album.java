package com.auditorium.model;

import java.util.ArrayList;
import java.util.List;

public final class Album extends AbstractModel {

    private final String title;
    private final String art;
    private final int tracks;
    private final List<Track> trackList;
    private final boolean isPublic;
    private final int likes;

    public Album(int id, String title, String art, int tracks, boolean isPublic) {
        super(id);
        this.title = title;
        this.art = art;
        this.tracks = tracks;
        this.trackList = new ArrayList<>();
        this.isPublic = isPublic;
        this.likes = 0;
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

    public List<Track> getTrackList() {
        return trackList;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public int getLikes() {
        return likes;
    }

    public void addTrack(Track track) {
        if (trackList.size() != tracks) {
            trackList.add(track);
        }
    }

}
