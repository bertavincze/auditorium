package com.auditorium.service.simple;

import com.auditorium.dao.PlaylistDao;
import com.auditorium.service.PlaylistService;

import java.sql.SQLException;

public class SimplePlaylistService implements PlaylistService {

    private final PlaylistDao playlistDao;

    public SimplePlaylistService(PlaylistDao playlistDao) {
        this.playlistDao = playlistDao;
    }

    @Override
    public void addNewUserPlaylist(String title, int userId) throws SQLException {
        playlistDao.addNewUserPlaylist(title, userId);
    }

    @Override
    public void addAlbumToUserPlaylist(int playlistId, int albumId) throws SQLException {
        playlistDao.addAlbumToUserPlaylist(playlistId, albumId);
    }
}
