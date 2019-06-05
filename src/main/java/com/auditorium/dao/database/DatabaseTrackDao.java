package com.auditorium.dao.database;

import com.auditorium.dao.TrackDao;
import com.auditorium.model.Track;

import java.sql.*;
import java.time.LocalTime;

public class DatabaseTrackDao extends AbstractDao implements TrackDao {

    public DatabaseTrackDao(Connection connection) {
        super(connection);
    }

    @Override
    public void addTrack(String title, LocalTime duration, int albumId) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "INSERT INTO tracks(title, duration, album_id) VALUES (?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, title);
            statement.setTime(2, Time.valueOf(duration));
            statement.setInt(3, albumId);
            executeInsert(statement);
            connection.commit();
        } catch (SQLException ex) {
            connection.rollback();
            throw ex;
        } finally {
            connection.setAutoCommit(autoCommit);
        }
    }

    @Override
    public Track findById(int id) throws SQLException {
        String sql = "SELECT * FROM tracks WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchTrack(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public Track findByTitle(String title) throws SQLException {
        String sql = "SELECT * FROM tracks WHERE title = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, title);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchTrack(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public void updateTrackTitleById(int id, String title) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "UPDATE tracks SET title = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, title);
            statement.setInt(2, id);
            executeInsert(statement);
            connection.commit();
        } catch (SQLException ex) {
            connection.rollback();
            throw ex;
        } finally {
            connection.setAutoCommit(autoCommit);
        }
    }

    @Override
    public void deleteTrackById(int id) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "DELETE FROM tracks WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            executeInsert(statement);
            connection.commit();
        } catch (SQLException ex) {
            connection.rollback();
            throw ex;
        } finally {
            connection.setAutoCommit(autoCommit);
        }
    }

    private Track fetchTrack(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String title = resultSet.getString("title");
        LocalTime duration = resultSet.getTime("duration").toLocalTime();
        int albumId = resultSet.getInt("album_id");
        return new Track(id, title, duration, albumId);
    }
}
