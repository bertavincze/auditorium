package com.auditorium.servlet;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dao.PlaylistDao;
import com.auditorium.dao.database.DatabaseAlbumDao;
import com.auditorium.dao.database.DatabasePlaylistDao;
import com.auditorium.dto.PlaylistDto;
import com.auditorium.model.Playlist;
import com.auditorium.model.User;
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
import java.util.ArrayList;
import java.util.List;

@WebServlet("/protected/playlists")
public class PlaylistsServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            AlbumDao albumDao = new DatabaseAlbumDao(connection);
            PlaylistDao playlistDao = new DatabasePlaylistDao(connection);
            AlbumService albumService = new SimpleAlbumService(albumDao);
            PlaylistService playlistService = new SimplePlaylistService(playlistDao);

            int userId = ((User) req.getSession().getAttribute("user")).getId();

            List<PlaylistDto> playlists = new ArrayList<>();
            for (Playlist playlist : playlistService.findAllByUser(userId)) {
                playlists.add(new PlaylistDto(playlist, albumService.findAllByPlaylistId(playlist.getId())));
            }

            sendMessage(resp, HttpServletResponse.SC_OK, playlists);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            PlaylistDao playlistDao = new DatabasePlaylistDao(connection);
            PlaylistService playlistService = new SimplePlaylistService(playlistDao);

            int userId = ((User) req.getSession().getAttribute("user")).getId();
            String title = req.getParameter("title");

            playlistService.addNewUserPlaylist(title, userId);

            sendMessage(resp, HttpServletResponse.SC_OK, "Playlist created.");
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            PlaylistDao playlistDao = new DatabasePlaylistDao(connection);
            PlaylistService playlistService = new SimplePlaylistService(playlistDao);

            int playlistId = Integer.parseInt(req.getParameter("playlistId"));

            playlistService.deleteById(playlistId);
            sendMessage(resp, HttpServletResponse.SC_OK, "Playlist deleted.");
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }
}
