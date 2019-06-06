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
        SimplePasswordService passwordService = new SimplePasswordService();
        try {
            User user = userDao.findByEmail(email);
            if (user == null || !passwordService.validatePassword(password, user.getPassword())) {
                throw new ServiceException("Bad login!");
            }
            return user;
        } catch (IllegalArgumentException ex) {
            throw new ServiceException(ex.getMessage());
        }
    }

    @Override
    public void addUser(String name, String email, String password, String role) throws SQLException {
        userDao.addUser(name, email, password, role);
    }

    @Override
    public void addNewUserPlaylist(String title, int userId) throws SQLException {
        userDao.addNewUserPlaylist(title, userId);
    }

    @Override
    public void addAlbumToUserPlaylist(int playlistId, int albumId) throws SQLException {
        userDao.addAlbumToUserPlaylist(playlistId, albumId);
    }

    @Override
    public List<User> findAll() throws SQLException {
        return userDao.findAll();
    }

    @Override
    public User findById(int id) throws SQLException {
        return userDao.findById(id);
    }

    @Override
    public User findByEmail(String email) throws SQLException {
        return userDao.findByEmail(email);
    }

    @Override
    public User findByName(String name) throws SQLException {
        return userDao.findByName(name);
    }

    @Override
    public void updateUserNameById(int id, String name) throws SQLException {
        userDao.updateUserNameById(id, name);
    }

    @Override
    public void updateUserEmailById(int id, String email) throws SQLException {
        userDao.updateUserEmailById(id, email);
    }

    @Override
    public void updateUserPasswordById(int id, String password) throws SQLException {
        userDao.updateUserPasswordById(id, password);
    }

    @Override
    public void updateUserRoleById(int id, String role) throws SQLException {
        userDao.updateUserRoleById(id, role);
    }

    @Override
    public void deleteUserById(int id) throws SQLException {
        userDao.deleteUserById(id);
    }
}
