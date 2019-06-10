package com.auditorium.servlet;

import com.auditorium.dao.UserDao;
import com.auditorium.dao.database.DatabaseUserDao;
import com.auditorium.model.User;
import com.auditorium.service.UserService;
import com.auditorium.service.simple.SimpleUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/profile")
public final class ProfileServlet extends AbstractServlet {

    private final ObjectMapper om = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = (User) req.getSession().getAttribute("user");

        sendMessage(resp, HttpServletResponse.SC_OK, user);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new DatabaseUserDao(connection);
            UserService userService = new SimpleUserService(userDao);

            User user = om.readValue(req.getInputStream(), User.class);
            userService.updateUserNameById(user.getId(), user.getName());
            userService.updateUserEmailById(user.getId(), user.getEmail());
            userService.updateUserPasswordById(user.getId(), user.getPassword());
            req.getSession().setAttribute("user", user);

            sendMessage(resp, HttpServletResponse.SC_OK, user);
        } catch (SQLException exc) {
            handleSqlError(resp, exc);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    }
}
