package com.auditorium.servlet;

import com.auditorium.dao.AlbumDao;
import com.auditorium.dao.database.DatabaseAlbumDao;
import com.auditorium.model.User;
import com.auditorium.service.AlbumService;
import com.auditorium.service.simple.SimpleAlbumService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/like")
public final class LikeServlet extends AbstractServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            AlbumDao albumDao = new DatabaseAlbumDao(connection);
            AlbumService albumService = new SimpleAlbumService(albumDao);

            int albumId = Integer.parseInt(req.getParameter("albumId"));
            int userId = ((User) req.getSession().getAttribute("user")).getId();

            albumService.likeAlbumById(userId, albumId);

            sendMessage(resp, HttpServletResponse.SC_OK, albumId);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    }

}
