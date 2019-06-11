package com.auditorium.servlet;

import com.auditorium.dao.TrackDao;
import com.auditorium.dao.database.DatabaseTrackDao;
import com.auditorium.service.TrackService;
import com.auditorium.service.simple.SimpleTrackService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalTime;

@WebServlet("/protected/track")
public final class TrackServlet extends AbstractServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TrackDao trackDao = new DatabaseTrackDao(connection);
            TrackService trackService = new SimpleTrackService(trackDao);

            int albumId = Integer.parseInt(req.getParameter("albumId"));
            String[] titles = req.getParameter("titles").split(",");

            for (String title : titles) {
                trackService.addTrack(title, LocalTime.of(0, 0, 5), albumId);
            }

            sendMessage(resp, HttpServletResponse.SC_OK, "Tracks added.");
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }

}
