package com.auditorium.servlet;

import com.auditorium.dao.UserDao;
import com.auditorium.dao.database.DatabaseUserDao;
import com.auditorium.model.User;
import com.auditorium.service.UserService;
import com.auditorium.service.exception.ServiceException;
import com.auditorium.service.simple.SimpleUserService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/login")
public final class LoginServlet extends AbstractServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new DatabaseUserDao(connection);
            UserService userService = new SimpleUserService(userDao);

            String email = req.getParameter("email");
            String password = req.getParameter("password");

            User user = userService.loginUser(email, password);
            req.getSession().setAttribute("user", user);

            sendMessage(resp, HttpServletResponse.SC_OK, user);
        } catch (ServiceException ex) {
            sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        }
    }
}
