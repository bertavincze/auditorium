package com.auditorium.dao;

import com.auditorium.model.Playlist;

import java.sql.SQLException;
import java.util.List;

public interface PlaylistDao {

    void addNewUserPlaylist(String title, int userId) throws SQLException;

    void addAlbumToUserPlaylist(int playlistId, int albumId) throws SQLException;

    Playlist findById(int playlistId) throws SQLException;

    List<Playlist> findAllByUser(int userId) throws SQLException;

    void updateTitleById(String title, int playlistId) throws SQLException;

    void deleteById(int playlistId) throws SQLException;

    void deleteAlbumFromPlaylist(int albumId, int playlistId) throws SQLException;
}
