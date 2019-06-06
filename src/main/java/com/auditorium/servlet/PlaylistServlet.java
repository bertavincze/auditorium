package com.auditorium.servlet;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dao.PlaylistDao;
import com.auditorium.dao.database.DatabaseAlbumDao;
import com.auditorium.dao.database.DatabasePlaylistDao;
import com.auditorium.dto.PlaylistDto;
import com.auditorium.service.AlbumService;
import com.auditorium.service.PlaylistService;
import com.auditorium.service.simple.SimpleAlbumService;
import com.auditorium.service.simple.SimplePlaylistService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/playlist")
public class PlaylistServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            AlbumDao albumDao = new DatabaseAlbumDao(connection);
            PlaylistDao playlistDao = new DatabasePlaylistDao(connection);
            AlbumService albumService = new SimpleAlbumService(albumDao);
            PlaylistService playlistService = new SimplePlaylistService(playlistDao);

            int playlistId = Integer.parseInt(req.getParameter("playlistId"));

            PlaylistDto playlistDto = new PlaylistDto(playlistService.findById(playlistId), albumService.findAllByPlaylistId(playlistId));

            sendMessage(resp, HttpServletResponse.SC_OK, playlistDto);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            PlaylistDao playlistDao = new DatabasePlaylistDao(connection);
            PlaylistService playlistService = new SimplePlaylistService(playlistDao);

            int albumId = Integer.parseInt(req.getParameter("albumId"));
            int playlistId = Integer.parseInt(req.getParameter("playlistId"));

            playlistService.addAlbumToUserPlaylist(playlistId, albumId);

            sendMessage(resp, HttpServletResponse.SC_OK, albumId);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            PlaylistDao playlistDao = new DatabasePlaylistDao(connection);
            PlaylistService playlistService = new SimplePlaylistService(playlistDao);

            int albumId = Integer.parseInt(req.getParameter("albumId"));
            int playlistId = Integer.parseInt(req.getParameter("playlistId"));

            playlistService.deleteAlbumFromPlaylist(albumId, playlistId);

            sendMessage(resp, HttpServletResponse.SC_OK, albumId);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }
}
