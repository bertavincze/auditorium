package com.auditorium.servlet;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dao.database.DatabaseAlbumDao;
import com.auditorium.dto.AlbumDto;
import com.auditorium.service.AlbumService;
import com.auditorium.service.simple.SimpleAlbumService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/album")
public final class AlbumServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            AlbumDao albumDao = new DatabaseAlbumDao(connection);
            AlbumService albumService = new SimpleAlbumService(albumDao);

            int albumId = Integer.parseInt(req.getParameter("albumId"));

            AlbumDto albumDto = new AlbumDto(
                albumService.findArtistByAlbumUserId(albumService.findById(albumId).getUserId()).getName(),
                albumService.findById(albumId),
                albumService.findTracksByAlbumId(albumId)
            );

            sendMessage(resp, HttpServletResponse.SC_OK, albumDto);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    }
}
