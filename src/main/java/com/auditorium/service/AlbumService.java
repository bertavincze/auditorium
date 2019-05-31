package com.auditorium.service;

import com.auditorium.dto.AlbumDto;
import com.auditorium.model.Album;

import java.sql.SQLException;
import java.util.List;

public interface AlbumService {

    void addAlbum(String name, String email, String password, String role) throws SQLException;

    List<Album> findAll() throws SQLException;

    List<Album> findAllPublic() throws SQLException;

    List<Album> sortByNewestFirst() throws SQLException;

    List<Album> sortByMostLikesFirst() throws SQLException;

    List<Album> findAllByUserId(int userId) throws SQLException;

    List<AlbumDto> findAllAlbumDto() throws SQLException;

    Album findById(int id) throws SQLException;

    Album findByTitle(String title) throws SQLException;

    void updateAlbumTitleById(int id, String title) throws SQLException;

    void updateAlbumArtById(int id, String artUrl) throws SQLException;

    void updateAlbumTracksById(int id, int tracks) throws SQLException;

    void updateAlbumVisibilityById(int id, boolean isPublic) throws SQLException;

    void likeAlbumById(int id) throws SQLException;

    void deleteAlbumById(int id) throws SQLException;
}
