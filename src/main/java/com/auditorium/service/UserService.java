package com.auditorium.service;

import com.auditorium.model.User;
import com.auditorium.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public interface UserService {

    User loginUser(String email, String password) throws SQLException, ServiceException;

    void addUser(String name, String email, String password, String role) throws SQLException;

    List<User> findAll() throws SQLException;

    User findById(int id) throws SQLException;

    User findByEmail(String email) throws SQLException;

    User findByName(String name) throws SQLException;

    void updateUserNameById(int id, String name) throws SQLException;

    void updateUserEmailById(int id, String email) throws SQLException;

    void updateUserPasswordById(int id, String password) throws SQLException;

    void updateUserRoleById(int id, String role) throws SQLException;

    void deleteUserById(int id) throws SQLException;
}
