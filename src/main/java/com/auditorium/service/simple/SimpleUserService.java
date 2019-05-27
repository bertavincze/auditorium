package com.auditorium.service.simple;

import com.auditorium.dao.UserDao;
import com.auditorium.model.User;
import com.auditorium.service.UserService;
import com.auditorium.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public final class SimpleUserService implements UserService {

    private final UserDao userDao;

    public SimpleUserService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public User loginUser(String email, String password) throws SQLException, ServiceException {
        return null;
    }

    @Override
    public void addUser(String name, String email, String password, String role) throws SQLException {

    }

    @Override
    public List<User> findAll() throws SQLException {
        return null;
    }

    @Override
    public User findById(int id) throws SQLException {
        return null;
    }

    @Override
    public User findByEmail(String email) throws SQLException {
        return null;
    }

    @Override
    public User findByName(String name) throws SQLException {
        return null;
    }

    @Override
    public void updateUserNameById(int id, String name) throws SQLException {

    }

    @Override
    public void updateUserEmailById(int id, String email) throws SQLException {

    }

    @Override
    public void updateUserPasswordById(int id, String password) throws SQLException {

    }

    @Override
    public void updateUserRoleById(int id, String role) throws SQLException {

    }

    @Override
    public void deleteUserById(int id) throws SQLException {

    }
}
