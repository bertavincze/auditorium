package com.auditorium.dao;

import java.sql.SQLException;

public interface PlaylistDao {

    void addNewUserPlaylist(String title, int userId) throws SQLException;

    void addAlbumToUserPlaylist(int playlistId, int albumId) throws SQLException;
}
