package com.auditorium.dao.database;

import com.auditorium.dao.AlbumDao;
import com.auditorium.model.Album;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

public class DatabaseAlbumDao extends AbstractDao implements AlbumDao {

    public DatabaseAlbumDao(Connection connection) {
        super(connection);
    }

    @Override
    public void addAlbum(String name, String email, String password, String role) throws SQLException {

    }

    @Override
    public List<Album> findAll() throws SQLException {
        return null;
    }

    @Override
    public List<Album> findAllPublic() throws SQLException {
        return null;
    }

    @Override
    public List<Album> sortByNewestFirst() throws SQLException {
        return null;
    }

    @Override
    public List<Album> sortByMostLikesFirst() throws SQLException {
        return null;
    }

    @Override
    public List<Album> findAllByUserId(int userId) throws SQLException {
        return null;
    }

    @Override
    public Album findById(int id) throws SQLException {
        return null;
    }

    @Override
    public Album findByTitle(String title) throws SQLException {
        return null;
    }

    @Override
    public void updateAlbumTitleById(int id, String title) throws SQLException {

    }

    @Override
    public void updateAlbumArtById(int id, String artUrl) throws SQLException {

    }

    @Override
    public void updateAlbumTracksById(int id, int tracks) throws SQLException {

    }

    @Override
    public void updateAlbumVisibilityById(int id, boolean isPublic) throws SQLException {

    }

    @Override
    public void likeAlbumById(int id) throws SQLException {

    }

    @Override
    public void deleteAlbumById(int id) throws SQLException {

    }

    private Album fetchAlbum(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        int userId = resultSet.getInt("user_id");
        String title = resultSet.getString("title");
        String art = resultSet.getString("art");
        int tracks = resultSet.getInt("tracks");
        boolean isPublic = resultSet.getBoolean("is_public");
        int likes = resultSet.getInt("likes");
        if (resultSet.getDate("date_published") == null) {
            return new Album(id, userId, title, art, tracks, isPublic, likes);
        } else {
            LocalDate datePublished = LocalDate.ofEpochDay(resultSet.getDate("date_published").getTime());
            return new Album(id, userId, title, art, tracks, isPublic, datePublished, likes);
        }
    }
}
