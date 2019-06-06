package com.auditorium.service;

import java.sql.SQLException;

public interface PlaylistService {

    void addNewUserPlaylist(String title, int userId) throws SQLException;

    void addAlbumToUserPlaylist(int playlistId, int albumId) throws SQLException;

}
