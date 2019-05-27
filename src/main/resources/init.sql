DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
	CONSTRAINT name_not_empty CHECK (name <> ''),
	CONSTRAINT email_not_empty CHECK (email <> ''),
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
    is_downloadable BOOLEAN NOT NULL,
    likes INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT title_not_empty CHECK (title <> ''),
	CONSTRAINT cover_art_not_empty CHECK (cover_art <> ''),
	CONSTRAINT tracks_check_between_bounds CHECK (tracks >= 1 AND tracks <= 12)
);

CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    duration NUMERIC NOT NULL,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (album_id) REFERENCES albums(id),
    CONSTRAINT title_not_empty CHECK (title <> '')
);

CREATE TABLE favourites (
    user_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, album_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (album_id) REFERENCES albums(id)
);

CREATE OR REPLACE FUNCTION set_date_published() RETURNS TRIGGER AS '
    BEGIN
        IF (TG_OP = ''INSERT'') THEN
            IF (NEW.is_public = true) THEN
            NEW.date_published = CURRENT_DATE
            END IF;
            ELSE IF (NEW.is_public = false) THEN
            NEW.date_published = NULL
            END IF;
        END IF;
        ELSE IF (TG_OP = ''UPDATE'') THEN
            IF (NEW.is_public = true AND OLD.is_public = false) THEN
            NEW.date_published = CURRENT_DATE
            END IF;
            ELSE IF (NEW.is_public = true AND OLD.is_public = true) THEN
            NEW.date_published = OLD.date_published
            END IF;
            ELSE IF (NEW.is_public = false AND OLD.is_public = true) THEN
            NEW.date_published = OLD.date_published
            END IF;
        END IF;
        RETURN NEW;
    END;
'

CREATE TRIGGER set_date_published
    BEFORE INSERT OR UPDATE ON albums
    FOR EACH ROW
    EXECUTE PROCEDURE set_date_published();

INSERT INTO users (email, name, password, role) VALUES
	('a', 'a', 'a', 'artist'),
	('r', 'r', 'r', 'regular');

INSERT INTO albums (user_id, title, cover_art, tracks, is_public, is_downloadable) VALUES
	('1', 'Boker Rocks', 'https://picsum.photos/800/600?random=1', 1, false, false);

INSERT INTO tracks (title, duration, album_id) VALUES
	('Erland Dryselius', 03:20, 1);

INSERT INTO favourites (user_id, album_id) VALUES
    (2, 1);
