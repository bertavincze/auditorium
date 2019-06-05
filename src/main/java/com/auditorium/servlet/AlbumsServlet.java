package com.auditorium.servlet;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dao.database.DatabaseAlbumDao;
import com.auditorium.dto.AlbumDto;
import com.auditorium.service.AlbumService;
import com.auditorium.service.simple.SimpleAlbumService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/albums")
public final class AlbumsServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            AlbumDao albumDao = new DatabaseAlbumDao(connection);
            AlbumService albumService = new SimpleAlbumService(albumDao);

            String sortMethod = req.getParameter("sort");

            if (sortMethod.equals("date")) {
                sendMessage(resp, HttpServletResponse.SC_OK, albumService.sortByNewestFirst());
            } else if (sortMethod.equals("likes")) {
                sendMessage(resp, HttpServletResponse.SC_OK, albumService.sortByMostLikesFirst());
            } else {
                sendMessage(resp, HttpServletResponse.SC_OK, albumService.findAllAlbumDto());
            }

        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    }
}
