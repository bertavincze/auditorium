DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS tracks;
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

CREATE TABLE album_ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    album_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (album_id) REFERENCES albums(id),
    CONSTRAINT check_rating_between_bounds CHECK (rating >= 1 AND rating <= 10)
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

CREATE TRIGGER set_date_published
    BEFORE INSERT OR UPDATE ON albums
    FOR EACH ROW
    EXECUTE PROCEDURE set_date_published();

INSERT INTO users (email, name, password, role) VALUES
	('a', 'a', 'a', 'artist'),
	('r', 'r', 'r', 'regular');

INSERT INTO albums (user_id, title, cover_art, tracks, is_public) VALUES
	('1', 'Boker Rocks', 'https://picsum.photos/800/600?random=1', 1, true);

INSERT INTO tracks (title, duration, album_id) VALUES
	('Erland Dryselius', '03:20', 1);

INSERT INTO favourites (user_id, album_id) VALUES
    (2, 1);

INSERT INTO album_ratings (user_id, album_id, rating) VALUES
	(1, 1, 10);
