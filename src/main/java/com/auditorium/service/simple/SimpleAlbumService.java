package com.auditorium.service.simple;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dto.AlbumDto;
import com.auditorium.model.Album;
import com.auditorium.model.Track;
import com.auditorium.model.User;
import com.auditorium.service.AlbumService;

import java.sql.SQLException;
import java.util.ArrayList;
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
    public List<AlbumDto> findAll() throws SQLException {
        List<AlbumDto> albums = new ArrayList<>();
        for (Album album: albumDao.findAll()) {
            albums.add(fetchAlbumDto(album));
        }
        return albums;
    }

    @Override
    public List<Album> findAllPublic() throws SQLException {
        return albumDao.findAllPublic();
    }

    @Override
    public List<AlbumDto> sortByNewestFirst() throws SQLException {
        List<AlbumDto> albums = new ArrayList<>();
        for (Album album: albumDao.sortByNewestFirst()) {
            albums.add(fetchAlbumDto(album));
        }
        return albums;
    }

    @Override
    public List<AlbumDto> sortByMostLikesFirst() throws SQLException {
        List<AlbumDto> albums = new ArrayList<>();
        for (Album album: albumDao.sortByMostLikesFirst()) {
            albums.add(fetchAlbumDto(album));
        }
        return albums;
    }

    @Override
    public List<Album> findAllByUserId(int userId) throws SQLException {
        return albumDao.findAllByUserId(userId);
    }

    @Override
    public List<AlbumDto> findAllAlbumDto() throws SQLException {
        List<AlbumDto> allAlbums = new ArrayList<>();
        List<Album> albums = findAllPublic();
        for (Album album : albums) {
            allAlbums.add(fetchAlbumDto(album));
        }
        return allAlbums;
    }

    @Override
    public Album findById(int id) throws SQLException {
        return albumDao.findById(id);
    }

    @Override
    public Album findByTitle(String title) throws SQLException {
        return albumDao.findByTitle(title);
    }

    @Override
    public User findArtistByAlbumUserId(int id) throws SQLException {
        return albumDao.findArtistByAlbumUserId(id);
    }

    @Override
    public List<Track> findTracksByAlbumId(int id) throws SQLException {
        return albumDao.findTracksByAlbumId(id);
    }

    @Override
    public void updateAlbumTitleById(int id, String title) throws SQLException {
        albumDao.updateAlbumTitleById(id, title);
    }

    @Override
    public void updateAlbumArtById(int id, String artUrl) throws SQLException {
        albumDao.updateAlbumArtById(id, artUrl);
    }

    @Override
    public void updateAlbumVisibilityById(int id, boolean isPublic) throws SQLException {
        albumDao.updateAlbumVisibilityById(id, isPublic);
    }

    @Override
    public void likeAlbumById(int id) throws SQLException {
        albumDao.likeAlbumById(id);
    }

    @Override
    public boolean isAlbumLikedByUser(int userId, int albumId) throws SQLException {
        return albumDao.isAlbumLikedByUser(userId, albumId);
    }

    @Override
    public void setAlbumLikesByUser(User user, List<AlbumDto> albums) throws SQLException {
        if (user != null) {
            for (AlbumDto albumDto : albums) {
                if (isAlbumLikedByUser(user.getId(), albumDto.getAlbum().getId())) {
                    albumDto.setLiked(true);
                }
            }
        }
    }

    @Override
    public void deleteAlbumById(int id) throws SQLException {
        albumDao.deleteAlbumById(id);
    }

    private AlbumDto fetchAlbumDto(Album album) throws SQLException {
        String artist = findArtistByAlbumUserId(album.getUserId()).getName();
        List<Track> tracks = findTracksByAlbumId(album.getId());
        return new AlbumDto(artist, album, tracks);
    }
}
