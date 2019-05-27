package com.auditorium.dao.database;

import com.auditorium.dao.TrackDao;
import com.auditorium.model.Track;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class DatabaseTrackDao extends AbstractDao implements TrackDao {

    public DatabaseTrackDao(Connection connection) {
        super(connection);
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
