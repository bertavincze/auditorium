package com.auditorium.servlet;

import com.auditorium.dao.UserDao;
import com.auditorium.dao.database.DatabaseUserDao;
import com.auditorium.model.User;
import com.auditorium.service.UserService;
import com.auditorium.service.exception.ServiceException;
import com.auditorium.service.simple.SimplePasswordService;
import com.auditorium.service.simple.SimpleUserService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/register")
public class RegisterServlet extends AbstractServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new DatabaseUserDao(connection);
            UserService userService = new SimpleUserService(userDao);
            SimplePasswordService passwordService = new SimplePasswordService();

            String name = req.getParameter("name");
            String email = req.getParameter("email");
            String password = passwordService.getHashedPassword(req.getParameter("password"));
            String role = req.getParameter("role");

            userService.addUser(name, email, password, role);
            User user = userService.findByEmail(email);
            req.getSession().setAttribute("user", user);
            sendMessage(resp, HttpServletResponse.SC_OK, user);
        } catch (SQLException ex) {
            handleSqlError(resp, ex);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }
}
