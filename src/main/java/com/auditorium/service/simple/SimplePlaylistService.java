package com.auditorium.service.simple;

import com.auditorium.dao.PlaylistDao;
import com.auditorium.dto.PlaylistDto;
import com.auditorium.model.Playlist;
import com.auditorium.service.PlaylistService;

import java.sql.SQLException;
import java.util.List;

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

    @Override
    public Playlist findById(int playlistId) throws SQLException {
        return playlistDao.findById(playlistId);
    }

    @Override
    public List<Playlist> findAllByUser(int userId) throws SQLException {
        return playlistDao.findAllByUser(userId);
    }

    @Override
    public void updateTitleById(String title, int playlistId) throws SQLException {
        playlistDao.updateTitleById(title, playlistId);
    }

    @Override
    public void deleteById(int playlistId) throws SQLException {
        playlistDao.deleteById(playlistId);
    }

    @Override
    public void deleteAlbumFromPlaylist(int albumId, int playlistId) throws SQLException {
        playlistDao.deleteAlbumFromPlaylist(albumId, playlistId);
    }

}
