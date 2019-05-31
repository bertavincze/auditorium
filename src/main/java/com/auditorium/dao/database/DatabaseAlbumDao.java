package com.auditorium.dao.database;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dto.AlbumDto;
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
    public void addAlbum(String name, String email, String password, String role) throws SQLException {

    }

    @Override
    public List<Album> findAll() throws SQLException {
        return null;
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
    public List<AlbumDto> findAllAlbumDto() throws SQLException {
        List<AlbumDto> allAlbumDtos = new ArrayList<>();
        List<Album> albums = findAllPublic();
        for (Album album : albums) {
            String artist = findArtistByAlbumUserId(album.getUserId()).getName();
            List<Track> tracks = findTracksByAlbumId(album.getId());
            allAlbumDtos.add(new AlbumDto(artist, album, tracks));
        }
        return allAlbumDtos;
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
