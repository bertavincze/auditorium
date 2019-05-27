package com.auditorium.service.simple;

import com.auditorium.dao.TrackDao;
import com.auditorium.model.Track;
import com.auditorium.service.TrackService;

import java.sql.SQLException;
import java.util.List;

public class SimpleTrackService implements TrackService {

    private final TrackDao trackDao;

    public SimpleTrackService(TrackDao trackDao) {
        this.trackDao = trackDao;
    }

    @Override
    public void addTrack(String title, int duration, int albumId) throws SQLException {

    }

    @Override
    public List<Track> findAllByAlbumId(int albumId) throws SQLException {
        return null;
    }

    @Override
    public Track findById(int id) throws SQLException {
        return null;
    }

    @Override
    public Track findByTitle(String title) throws SQLException {
        return null;
    }

    @Override
    public void updateTrackTitleById(int id, String title) throws SQLException {

    }

    @Override
    public void deleteTrackById(int id) throws SQLException {

    }
}
