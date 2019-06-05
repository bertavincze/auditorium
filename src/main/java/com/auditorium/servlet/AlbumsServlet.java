package com.auditorium.servlet;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dao.database.DatabaseAlbumDao;
import com.auditorium.dto.AlbumDto;
import com.auditorium.model.User;
import com.auditorium.service.AlbumService;
import com.auditorium.service.simple.SimpleAlbumService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/albums")
public final class AlbumsServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            AlbumDao albumDao = new DatabaseAlbumDao(connection);
            AlbumService albumService = new SimpleAlbumService(albumDao);
            User user = (User) req.getSession().getAttribute("user");

            String sortMethod = req.getParameter("sort");
            List<AlbumDto> albums;

            if (sortMethod.equals("date")) {
                albums = albumService.sortByNewestFirst();
            } else if (sortMethod.equals("likes")) {
                albums = albumService.sortByMostLikesFirst();
            } else {
                albums = albumService.findAllAlbumDto();
            }

            albumService.setAlbumLikesByUser(user, albums);
            sendMessage(resp, HttpServletResponse.SC_OK, albums);

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
