package com.auditorium.dao.database;

import com.auditorium.dao.AlbumDao;
import com.auditorium.model.Album;
import com.auditorium.model.Track;
import com.auditorium.model.User;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DatabaseAlbumDao extends AbstractDao implements AlbumDao {

    public DatabaseAlbumDao(Connection connection) {
        super(connection);
    }

    @Override
    public void addAlbum(int userId, String title, String cover_art, int tracks, boolean isPublic) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "INSERT INTO albums(user_id, title, cover_art, tracks, is_public) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            statement.setString(2, title);
            statement.setString(3, cover_art);
            statement.setInt(4, tracks);
            statement.setBoolean(5, isPublic);
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
    public List<Album> findAll() throws SQLException {
        List<Album> albums = new ArrayList<>();
        String sql = "SELECT * FROM albums";
        try (Statement statement = connection.createStatement(); ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                albums.add(fetchAlbum(resultSet));
            }
            return albums;
        }
    }

    @Override
    public List<Album> findAllPublic() throws SQLException {
        List<Album> albums = new ArrayList<>();
        String sql = "SELECT * FROM albums WHERE is_public = true";
        try (Statement statement = connection.createStatement(); ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                albums.add(fetchAlbum(resultSet));
            }
            return albums;
        }
    }

    @Override
    public List<Album> sortByNewestFirst() throws SQLException {
        List<Album> albums = new ArrayList<>();
        String sql = "SELECT * FROM albums WHERE is_public = true ORDER BY date_published DESC";
        try (Statement statement = connection.createStatement(); ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                albums.add(fetchAlbum(resultSet));
            }
            return albums;
        }
    }

    @Override
    public List<Album> sortByMostLikesFirst() throws SQLException {
        List<Album> albums = new ArrayList<>();
        String sql = "SELECT * FROM albums WHERE is_public = true ORDER BY likes DESC";
        try (Statement statement = connection.createStatement(); ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                albums.add(fetchAlbum(resultSet));
            }
            return albums;
        }
    }

    @Override
    public List<Album> findAllByUserId(int userId) throws SQLException {
        List<Album> albums = new ArrayList<>();
        String sql = "SELECT * FROM albums WHERE user_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    albums.add(fetchAlbum(resultSet));
                }
            }
        }
        return albums;
    }

    @Override
    public List<Album> findAllByPlaylistId(int playlistId) throws SQLException {
        List<Album> albums = new ArrayList<>();
        String sql = "SELECT id, user_id, title, cover_art, tracks, is_public, date_published, likes FROM albums " +
            "JOIN playlist_albums ON playlist_albums.album_id = albums.id WHERE playlist_albums.playlist_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, playlistId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    albums.add(fetchAlbum(resultSet));
                }
            }
        }
        return albums;
    }

    @Override
    public Album findById(int id) throws SQLException {
        String sql = "SELECT * FROM albums WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchAlbum(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public Album findByTitle(String title) throws SQLException {
        String sql = "SELECT * FROM albums WHERE title = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, title);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchAlbum(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public User findArtistByAlbumUserId(int id) throws SQLException {
        String sql = "SELECT * FROM users WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return new User(resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getString("email"),
                        resultSet.getString("password"),
                        resultSet.getString("role")
                    );
                }
            }
        }
        return null;
    }

    @Override
    public List<Track> findTracksByAlbumId(int id) throws SQLException {
        List<Track> tracks = new ArrayList<>();
        String sql = "SELECT * FROM tracks WHERE album_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    tracks.add(new Track(
                        resultSet.getInt("id"),
                        resultSet.getString("title"),
                        resultSet.getTime("duration").toLocalTime(),
                        resultSet.getInt("album_id")
                    ));
                }
                return tracks;
            }
        }
    }

    @Override
    public void updateAlbumTitleById(int id, String title) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "UPDATE albums SET title = ? WHERE id = ?";
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
    public void updateAlbumArtById(int id, String artUrl) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "UPDATE albums SET cover_art = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, artUrl);
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
    public void updateAlbumVisibilityById(int id, boolean isPublic) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "UPDATE albums SET is_public = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setBoolean(1, isPublic);
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
    public void likeAlbumById(int userId, int albumId) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "INSERT INTO album_likes(user_id, album_id) VALUES (?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            statement.setInt(2, albumId);
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
    public boolean isAlbumLikedByUser(int userId, int albumId) throws SQLException {
        String sql = "SELECT EXISTS(SELECT 1 FROM album_likes WHERE user_id = ? AND album_id = ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            statement.setInt(2, albumId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getBoolean("exists");
                }
            }
        }
        return false;
    }

    @Override
    public void deleteAlbumById(int id) throws SQLException {
        boolean autoCommit = connection.getAutoCommit();
        connection.setAutoCommit(false);
        String sql = "DELETE FROM albums WHERE id = ?";
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

    private Album fetchAlbum(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        int userId = resultSet.getInt("user_id");
        String title = resultSet.getString("title");
        String art = resultSet.getString("cover_art");
        int tracks = resultSet.getInt("tracks");
        boolean isPublic = resultSet.getBoolean("is_public");
        int likes = resultSet.getInt("likes");
        if (resultSet.getDate("date_published") == null) {
            return new Album(id, userId, title, art, tracks, isPublic, likes);
        } else {
            LocalDate datePublished = resultSet.getDate("date_published").toLocalDate();
            return new Album(id, userId, title, art, tracks, isPublic, datePublished, likes);
        }
    }

}
