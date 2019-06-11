DROP TABLE IF EXISTS playlist_albums;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS album_likes;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    CONSTRAINT email_not_empty CHECK (email <> ''),
    CONSTRAINT name_not_empty CHECK (name <> ''),
    CONSTRAINT password_not_empty CHECK (password <> ''),
    CONSTRAINT role_is_valid CHECK (role = 'artist' OR role = 'regular')
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    cover_art TEXT NOT NULL,
    tracks INTEGER NOT NULL,
    is_public BOOLEAN NOT NULL,
    date_published DATE,
    likes INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT title_not_empty CHECK (title <> ''),
    CONSTRAINT cover_art_not_empty CHECK (cover_art <> ''),
    CONSTRAINT tracks_check_between_bounds CHECK (tracks >= 1 AND tracks <= 12)
);

CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    duration TIME NOT NULL,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    CONSTRAINT title_not_empty CHECK (title <> '')
);

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT title_not_empty CHECK (title <> '')
);

CREATE TABLE playlist_albums (
    playlist_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE TABLE album_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION set_date_published()
RETURNS TRIGGER AS
    'BEGIN
        IF (TG_OP = ''INSERT'') THEN
            IF (NEW.is_public = true) THEN
                NEW.date_published = now();
            ELSE
                NEW.date_published = NULL;
            END IF;
        ELSIF (TG_OP = ''UPDATE'') THEN
            IF (NEW.is_public = true AND OLD.is_public = false) THEN
            	NEW.date_published = now();
            ELSIF (NEW.is_public = true AND OLD.is_public = true) THEN
            	NEW.date_published = OLD.date_published;
            ELSIF (NEW.is_public = false AND OLD.is_public = true) THEN
            	NEW.date_published = OLD.date_published;
            END IF;
	END IF;
    RETURN NEW;
    END;
'LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_like_uniqueness()
RETURNS TRIGGER AS
    'BEGIN
        IF (SELECT EXISTS(SELECT 1 FROM album_likes WHERE user_id = NEW.user_id AND album_id = NEW.album_id) = true) THEN
            RAISE EXCEPTION ''You have already liked this album!'';
        ELSE
            UPDATE albums SET likes = likes + 1 WHERE id = NEW.album_id;
            RETURN NEW;
        END IF;
    END;
'LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_playlist_title_uniqueness()
RETURNS TRIGGER AS
    'BEGIN
        IF (SELECT EXISTS(SELECT 1 FROM playlists WHERE user_id = NEW.user_id AND title = NEW.title) = true) THEN
            RAISE EXCEPTION ''A playlist by this title already exists!'';
        ELSE
            RETURN NEW;
        END IF;
    END;
'LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_playlist_album_uniqueness()
RETURNS TRIGGER AS
    'BEGIN
        IF (SELECT EXISTS(SELECT 1 FROM playlist_albums WHERE album_id = NEW.album_id AND playlist_id = NEW.playlist_id) = true) THEN
            RAISE EXCEPTION ''This album is already on this playlist!'';
        ELSE
            RETURN NEW;
        END IF;
    END;
'LANGUAGE plpgsql;

CREATE TRIGGER set_date_published
    BEFORE INSERT OR UPDATE ON albums
    FOR EACH ROW
    EXECUTE PROCEDURE set_date_published();

CREATE TRIGGER check_like_uniqueness
    BEFORE INSERT ON album_likes
    FOR EACH ROW
    EXECUTE PROCEDURE check_like_uniqueness();

CREATE TRIGGER check_playlist_title_uniqueness
    BEFORE INSERT ON playlists
    FOR EACH ROW
    EXECUTE PROCEDURE check_playlist_title_uniqueness();

CREATE TRIGGER check_playlist_album_uniqueness
    BEFORE INSERT ON playlist_albums
    FOR EACH ROW
    EXECUTE PROCEDURE check_playlist_album_uniqueness();

INSERT INTO users (email, name, password, role) VALUES
    ('jaimenye@gmail.com', 'Jaime Nye', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('kelseymercury@gmail.com', 'Kelsey Mercury', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('avenueofwit@gmail.com', 'Avenue of Wit', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('crazymen@gmail.com', 'Crazy Men', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('ministerofstorms@gmail.com', 'Minister of Storms', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('donnieliving@gmail.com', 'Donnie Living', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('billiedavis@gmail.com', 'Billie Davis', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('quillboar@gmail.com', 'Quillboar', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('soundwavething@gmail.com', 'Soundwave Thing', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('johnniestrange@gmail.com', 'Johnnie Strange', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('standbybards@gmail.com', 'Standby Bards', '1000:52a2e5376fe9155814775f1e3231a526:191ade9da2dcbabfc870ba70263b7af6865b40d8e179d19e8ea504d257810c6e78a316d77f5bd8716a7fa54f39b1f082c773ca80b45526dd59c933522e341216', 'artist'),
    ('janedoe@gmail.com', 'Jane Doe', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('johndoe@gmail.com', 'John Doe', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('johnsmith@gmail.com', 'John Smith', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('gideonsnow@gmail.com', 'Gideon Snow', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('laylabrooks@gmail.com', 'Layla Brooks', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('tamiacherry@gmail.com', 'Tamia Cherry', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('isaacchambers@gmail.com', 'Isaac Chambers', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('tommyfox@gmail.com', 'Tommy Fox', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('williemonroe@gmail.com', 'Willie Monroe', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('lydiamaldonado@gmail.com', 'Lydia Maldonado', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('lucymason@gmail.com', 'Lucy Mason', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('jessiegibson@gmail.com', 'Jessie Gibson', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('katiesmith@gmail.com', 'Katie Smith', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('caseylambert@gmail.com', 'Casey Lambert', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('jaidenabbott@gmail.com', 'Jaiden Abbott', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('paisleyayers@gmail.com', 'Paisley Ayers', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('estherweber@gmail.com', 'Esther Weber', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('gailwillis@gmail.com', 'Gail Willis', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('olivermills@gmail.com', 'Oliver Mills', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('spencermorris@gmail.com', 'Spencer Morris', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular'),
    ('scarlettpope@gmail.com', 'Scarlett Pope', '1000:12b64240b3c5da1f64daa0d26dbd7bfb:e314534adbb83fa0d605557a1d7394f6936b10efcfc89cae85260e69ad452241cbdd6d043ae51ecc92e8776b4aa369fa6afb028cac5254f9cc7a4e8eae0722c2', 'regular');

INSERT INTO albums (user_id, title, cover_art, tracks, is_public, likes) VALUES
    (1, 'Boker Rocks', 'https://picsum.photos/id/76/800/600', 3, true, 10), -- 1
    (1, 'Primitive Enema', 'https://picsum.photos/id/953/800/600', 1, true, 5), -- 2
    (2, 'The Great Jazz Trio at the Village Vanguard', 'https://picsum.photos/id/1025/800/600', 1, true, 8), -- 3
    (2, 'Chartreuse', 'https://picsum.photos/id/1013/800/600', 1, true, 12), -- 4
    (3, 'Embedding Theorem', 'https://picsum.photos/id/1042/800/600', 5, true, 18), -- 5
    (3, 'Common Purpose', 'https://picsum.photos/id/1047/800/600', 1, true, 9), -- 6
    (4, 'Hook-billed Hermit', 'https://picsum.photos/id/1059/800/600', 1, true, 2), -- 7
    (5, 'Jozef Bomba', 'https://picsum.photos/id/418/800/600', 2, true, 28), -- 8
    (5, 'Legislature', 'https://picsum.photos/id/1073/800/600', 2, true, 10), -- 9
    (5, 'Purple Government', 'https://picsum.photos/id/433/800/600', 1, true, 9), -- 10
    (6, 'Soar, Gwynedd', 'https://picsum.photos/id/345/800/600', 4, true, 22), -- 11
    (6, 'Vienna Codex', 'https://picsum.photos/id/548/800/600', 4, true, 13), -- 12
    (7, 'Warm Spring', 'https://picsum.photos/id/308/800/600', 1, true, 15), -- 13
    (8, 'Chi Gamma Epsilon', 'https://picsum.photos/id/274/800/600', 1, true, 3), -- 14
    (8, 'Humble Pie', 'https://picsum.photos/id/655/800/600', 1, true, 4), -- 15
    (8, 'Giants (Mayfair Games)', 'https://picsum.photos/id/494/800/600', 1, true, 4), -- 16
    (9, 'Galloway Artillery Volunteers', 'https://picsum.photos/id/383/800/600', 1, true, 3), -- 17
    (9, 'Lake Kenozero', 'https://picsum.photos/id/515/800/600', 1, true, 3), -- 18
    (10, 'Battle of Hyelion and Leimocheir', 'https://picsum.photos/id/173/800/600', 1, true, 2), --19
    (10, 'Papyrus Oxyrhynchus 68', 'https://picsum.photos/id/380/800/600', 2, true, 19), -- 20
    (11, 'Center for Indoor Air Research', 'https://picsum.photos/id/352/800/600', 2, true, 1), -- 21
    (11, 'Let the Corpses Tan', 'https://picsum.photos/id/14/800/600', 2, true, 20); -- 22

INSERT INTO tracks (title, duration, album_id) VALUES
    ('Erland Dryselius', '00:00:05', 1),
    ('The Morlocks', '00:00:05', 1),
    ('The Book of Souls', '00:00:05', 1),
    ('1483 in Ireland', '00:00:05', 2),
    ('Scarlet Pages', '00:00:05', 3),
    ('The Deal', '00:00:05', 4),
    ('Blue Star Ferries', '00:00:05', 5),
    ('Sam Christie', '00:00:05', 5),
    ('Black Codes', '00:00:05', 5),
    ('Netguru', '00:00:05', 5),
    ('Chambers', '00:00:05', 5),
    ('Railway Station', '00:00:05', 6),
    ('Fetal Development', '00:00:05', 7),
    ('You are the man', '00:00:05', 8),
    ('Dramatic Youth', '00:00:05', 8),
    ('Phantomsmasher', '00:00:05', 8),
    ('Runaway Roadtrip', '00:00:05', 9),
    ('Landed Gentry', '00:00:05', 9),
    ('Determinant', '00:00:05', 10),
    ('Cricket Club', '00:00:05', 11),
    ('Drop Tower', '00:00:05', 11),
    ('Gettysburg Address', '00:00:05', 11),
    ('Crown of the Netherlands', '00:00:05', 11),
    ('Presidential Cup', '00:00:05', 12),
    ('Rock of Ages', '00:00:05', 12),
    ('Four Decades', '00:00:05', 12),
    ('Blackbirds', '00:00:05', 12),
    ('The Standard of Perfection', '00:00:05', 13),
    ('Lord Jim', '00:00:05', 14),
    ('Theory of Discovery', '00:00:05', 15),
    ('Colonial Theater', '00:00:05', 16),
    ('Paragraph 175', '00:00:05', 17),
    ('Reformist', '00:00:05', 18),
    ('Mystery Films', '00:00:05', 20),
    ('The Conch', '00:00:05', 21),
    ('All in Good Time', '00:00:05', 21),
    ('Tony', '00:00:05', 22),
    ('Train Disaster', '00:00:05', 22);

INSERT INTO album_likes (user_id, album_id) VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1),
    (6, 1),
    (7, 1),
    (8, 1),
    (9, 1),
    (10, 1),
    (1, 2),
    (2, 2),
    (3, 2),
    (4, 2),
    (5, 2),
    (1, 3),
    (2, 3),
    (3, 3),
    (4, 3),
    (5, 3),
    (6, 3),
    (7, 3),
    (8, 3),
    (1, 4),
    (2, 4),
    (3, 4),
    (4, 4),
    (5, 4),
    (6, 4),
    (7, 4),
    (8, 4),
    (9, 4),
    (10, 4),
    (11, 4),
    (12, 4),
    (1, 5),
    (2, 5),
    (3, 5),
    (4, 5),
    (5, 5),
    (6, 5),
    (7, 5),
    (8, 5),
    (9, 5),
    (10, 5),
    (11, 5),
    (12, 5),
    (13, 5),
    (14, 5),
    (15, 5),
    (16, 5),
    (17, 5),
    (18, 5),
    (1, 6),
    (2, 6),
    (3, 6),
    (4, 6),
    (5, 6),
    (6, 6),
    (7, 6),
    (8, 6),
    (9, 6),
    (1, 7),
    (2, 7),
    (1, 8),
    (2, 8),
    (3, 8),
    (4, 8),
    (5, 8),
    (6, 8),
    (7, 8),
    (8, 8),
    (9, 8),
    (10, 8),
    (11, 8),
    (12, 8),
    (13, 8),
    (14, 8),
    (15, 8),
    (16, 8),
    (17, 8),
    (18, 8),
    (19, 8),
    (20, 8),
    (21, 8),
    (22, 8),
    (23, 8),
    (24, 8),
    (25, 8),
    (26, 8),
    (27, 8),
    (28, 8),
    (1, 9),
    (2, 9),
    (3, 9),
    (4, 9),
    (5, 9),
    (6, 9),
    (7, 9),
    (8, 9),
    (9, 9),
    (10, 9),
    (1, 10),
    (2, 10),
    (3, 10),
    (4, 10),
    (5, 10),
    (6, 10),
    (7, 10),
    (8, 10),
    (9, 10),
    (1, 11),
    (2, 11),
    (3, 11),
    (4, 11),
    (5, 11),
    (6, 11),
    (7, 11),
    (8, 11),
    (9, 11),
    (10, 11),
    (11, 11),
    (12, 11),
    (13, 11),
    (14, 11),
    (15, 11),
    (16, 11),
    (17, 11),
    (18, 11),
    (19, 11),
    (20, 11),
    (21, 11),
    (22, 11),
    (1, 12),
    (2, 12),
    (3, 12),
    (4, 12),
    (5, 12),
    (6, 12),
    (7, 12),
    (8, 12),
    (9, 12),
    (10, 12),
    (11, 12),
    (12, 12),
    (13, 12),
    (1, 13),
    (2, 13),
    (3, 13),
    (4, 13),
    (5, 13),
    (6, 13),
    (7, 13),
    (8, 13),
    (9, 13),
    (10, 13),
    (11, 13),
    (12, 13),
    (13, 13),
    (14, 13),
    (15, 13),
    (1, 14),
    (2, 14),
    (3, 14),
    (1, 15),
    (2, 15),
    (3, 15),
    (4, 15),
    (1, 16),
    (2, 16),
    (3, 16),
    (4, 16),
    (1, 17),
    (2, 17),
    (3, 17),
    (1, 18),
    (2, 18),
    (3, 18),
    (1, 19),
    (2, 19),
    (1, 20),
    (2, 20),
    (3, 20),
    (4, 20),
    (5, 20),
    (6, 20),
    (7, 20),
    (8, 20),
    (9, 20),
    (10, 20),
    (11, 20),
    (12, 20),
    (13, 20),
    (14, 20),
    (15, 20),
    (16, 20),
    (17, 20),
    (18, 20),
    (19, 20),
    (1, 21),
    (1, 22),
    (2, 22),
    (3, 22),
    (4, 22),
    (5, 22),
    (6, 22),
    (7, 22),
    (8, 22),
    (9, 22),
    (10, 22),
    (11, 22),
    (12, 22),
    (13, 22),
    (14, 22),
    (15, 22),
    (16, 22),
    (17, 22),
    (18, 22),
    (19, 22),
    (22, 22);

INSERT INTO playlists(title, user_id) VALUES
    ('My Playlist', 1);

INSERT INTO playlist_albums(playlist_id, album_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3);
