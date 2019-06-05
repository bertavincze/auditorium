package com.auditorium.service.simple;

import com.auditorium.dao.TrackDao;
import com.auditorium.model.Track;
import com.auditorium.service.TrackService;

import java.sql.SQLException;
import java.time.LocalTime;
import java.util.List;

public class SimpleTrackService implements TrackService {

    private final TrackDao trackDao;

    public SimpleTrackService(TrackDao trackDao) {
        this.trackDao = trackDao;
    }

    @Override
    public void addTrack(String title, LocalTime duration, int albumId) throws SQLException {
        trackDao.addTrack(title, duration, albumId);
    }

    @Override
    public Track findById(int id) throws SQLException {
        return trackDao.findById(id);
    }

    @Override
    public Track findByTitle(String title) throws SQLException {
        return trackDao.findByTitle(title);
    }

    @Override
    public void updateTrackTitleById(int id, String title) throws SQLException {
        trackDao.updateTrackTitleById(id, title);
    }

    @Override
    public void deleteTrackById(int id) throws SQLException {
        trackDao.deleteTrackById(id);
    }
}
