package com.auditorium.service.simple;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dto.AlbumDto;
import com.auditorium.model.Album;
import com.auditorium.service.AlbumService;

import java.sql.SQLException;
import java.util.List;

public class SimpleAlbumService implements AlbumService {

    private final AlbumDao albumDao;

    public SimpleAlbumService(AlbumDao albumDao) {
        this.albumDao = albumDao;
    }

    @Override
    public void addAlbum(int userId, String title, String cover_art, int tracks, boolean isPublic) throws SQLException {
        albumDao.addAlbum(userId, title, cover_art, tracks, isPublic);
    }

    @Override
    public List<Album> findAll() throws SQLException {
        return null;
    }

    @Override
    public List<Album> findAllPublic() throws SQLException {
        return albumDao.findAllPublic();
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
        return albumDao.findAllAlbumDto();
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
}
