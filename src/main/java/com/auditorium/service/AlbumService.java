package com.auditorium.service;

import com.auditorium.dto.AlbumDto;
import com.auditorium.model.Album;
import com.auditorium.model.Track;
import com.auditorium.model.User;

import java.sql.SQLException;
import java.util.List;

public interface AlbumService {

    void addAlbum(int userId, String title, String cover_art, int tracks, boolean isPublic) throws SQLException;

    List<AlbumDto> findAll() throws SQLException;

    List<Album> findAllPublic() throws SQLException;

    List<AlbumDto> sortByNewestFirst() throws SQLException;

    List<AlbumDto> sortByMostLikesFirst() throws SQLException;

    List<Album> findAllByUserId(int userId) throws SQLException;

    List<AlbumDto> findAllAlbumDto() throws SQLException;

    Album findById(int id) throws SQLException;

    Album findByTitle(String title) throws SQLException;

    User findArtistByAlbumUserId(int id) throws SQLException;

    List<Track> findTracksByAlbumId(int id) throws SQLException;

    void updateAlbumTitleById(int id, String title) throws SQLException;

    void updateAlbumArtById(int id, String artUrl) throws SQLException;

    void updateAlbumVisibilityById(int id, boolean isPublic) throws SQLException;

    void likeAlbumById(int userId, int albumId) throws SQLException;

    boolean isAlbumLikedByUser(int userId, int albumId) throws SQLException;

    void setAlbumLikesByUser(User user, List<AlbumDto> albums) throws SQLException;

    void deleteAlbumById(int id) throws SQLException;
}
