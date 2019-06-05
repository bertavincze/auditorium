package com.auditorium.dao;

import com.auditorium.model.Track;

import java.sql.SQLException;
import java.time.LocalTime;

public interface TrackDao {

    void addTrack(String title, LocalTime duration, int albumId) throws SQLException;

    Track findById(int id) throws SQLException;

    Track findByTitle(String title) throws SQLException;

    void updateTrackTitleById(int id, String title) throws SQLException;

    void deleteTrackById(int id) throws SQLException;
}
