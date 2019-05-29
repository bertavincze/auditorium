DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS album_ratings;
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
    ('jaimenye@gmail.com', 'Jaime Nye', 'a', 'artist'),
    ('kelseymercury@gmail.com', 'Kelsey Mercury', 'a', 'artist'),
    ('avenueofwit@gmail.com', 'Avenue of Wit', 'a', 'artist'),
    ('crazymen@gmail.com', 'Crazy Men', 'a', 'artist'),
    ('ministerofstorms@gmail.com', 'Minister of Storms', 'a', 'artist'),
    ('donnieliving@gmail.com', 'Donnie Living', 'a', 'artist'),
    ('billiedavis@gmail.com', 'Billie Davis', 'a', 'artist'),
    ('quillboar@gmail.com', 'Quillboar', 'a', 'artist'),
    ('soundwavething@gmail.com', 'Soundwave Thing', 'a', 'artist'),
    ('johnniestrange@gmail.com', 'Johnnie Strange', 'a', 'artist'),
    ('standbybards@gmail.com', 'Standby Bards', 'a', 'artist'),
    ('janedoe@gmail.com', 'Jane Doe', 'r', 'regular'),
    ('johndoe@gmail.com', 'John Doe', 'r', 'regular'),
    ('johnsmith@gmail.com', 'John Smith', 'r', 'regular'),
    ('gideonsnow@gmail.com', 'Gideon Snow', 'r', 'regular'),
    ('laylabrooks@gmail.com', 'Layla Brooks', 'r', 'regular'),
    ('tamiacherry@gmail.com', 'Tamia Cherry', 'r', 'regular'),
    ('isaacchambers@gmail.com', 'Isaac Chambers', 'r', 'regular'),
    ('tommyfox@gmail.com', 'Tommy Fox', 'r', 'regular'),
    ('williemonroe@gmail.com', 'Willie Monroe', 'r', 'regular'),
    ('lydiamaldonado@gmail.com', 'Lydia Maldonado', 'r', 'regular'),
    ('lucymason@gmail.com', 'Lucy Mason', 'r', 'regular'),
    ('jessiegibson@gmail.com', 'Jessie Gibson', 'r', 'regular'),
    ('katiesmith@gmail.com', 'Katie Smith', 'r', 'regular'),
    ('caseylambert@gmail.com', 'Casey Lambert', 'r', 'regular'),
    ('jaidenabbott@gmail.com', 'Jaiden Abbott', 'r', 'regular'),
    ('paisleyayers@gmail.com', 'Paisley Ayers', 'r', 'regular'),
    ('estherweber@gmail.com', 'Esther Weber', 'r', 'regular'),
    ('gailwillis@gmail.com', 'Gail Willis', 'r', 'regular'),
    ('olivermills@gmail.com', 'Oliver Mills', 'r', 'regular'),
    ('spencermorris@gmail.com', 'Spencer Morris', 'r', 'regular'),
    ('scarlettpope@gmail.com', 'Scarlett Pope', 'r', 'regular');

INSERT INTO albums (user_id, title, cover_art, tracks, is_public) VALUES
    (1, 'Boker Rocks', 'https://picsum.photos/id/76/800/600', 3, true),
    (1, 'Primitive Enema', 'https://picsum.photos/id/953/800/600', 1, true),
    (2, 'The Great Jazz Trio at the Village Vanguard', 'https://picsum.photos/id/1025/800/600', 1, true),
    (2, 'Chartreuse', 'https://picsum.photos/id/1013/800/600', 1, true),
    (3, 'Embedding Theorem', 'https://picsum.photos/id/1042/800/600', 5, true),
    (3, 'Common Purpose', 'https://picsum.photos/id/1047/800/600', 1, true),
    (4, 'Hook-billed Hermit', 'https://picsum.photos/id/1059/800/600', 1, true),
    (5, 'Jozef Bomba', 'https://picsum.photos/id/418/800/600', 2, true),
    (5, 'Legislature', 'https://picsum.photos/id/1073/800/600', 2, true),
    (5, 'Purple Government', 'https://picsum.photos/id/433/800/600', 1, true),
    (6, 'Soar, Gwynedd', 'https://picsum.photos/id/345/800/600', 4, true),
    (6, 'Vienna Codex', 'https://picsum.photos/id/548/800/600', 4, true),
    (7, 'Warm Spring', 'https://picsum.photos/id/308/800/600', 1, true),
    (8, 'Chi Gamma Epsilon', 'https://picsum.photos/id/274/800/600', 1, true),
    (8, 'Humble Pie', 'https://picsum.photos/id/655/800/600', 1, true),
    (8, 'Giants (Mayfair Games)', 'https://picsum.photos/id/494/800/600', 1, true),
    (9, 'Galloway Artillery Volunteers', 'https://picsum.photos/id/383/800/600', 1, true),
    (9, 'Lake Kenozero', 'https://picsum.photos/id/515/800/600', 1, true),
    (10, 'Battle of Hyelion and Leimocheir', 'https://picsum.photos/id/173/800/600', 1, true),
    (10, 'Papyrus Oxyrhynchus 68', 'https://picsum.photos/id/380/800/600', 2, true),
    (11, 'Center for Indoor Air Research', 'https://picsum.photos/id/352/800/600', 2, true),
    (11, 'Let the Corpses Tan', 'https://picsum.photos/id/14/800/600', 2, true);

INSERT INTO tracks (title, duration, album_id) VALUES
    ('Erland Dryselius', '00:10', 1),
    ('The Morlocks', '00:10', 1),
    ('The Book of Souls', '00:10', 1),
    ('1483 in Ireland', '00:10', 2),
    ('Scarlet Pages', '00:10', 3),
    ('The Deal', '00:10', 4),
    ('Blue Star Ferries', '00:10', 5),
    ('Sam Christie', '00:10', 5),
    ('Black Codes', '00:10', 5),
    ('Netguru', '00:10', 5),
    ('Chambers', '00:10', 5),
    ('Railway Station', '00:10', 6),
    ('Fetal Development', '00:10', 7),
    ('You are the man', '00:10', 8),
    ('Dramatic Youth', '00:10', 8),
    ('Phantomsmasher', '00:10', 8),
    ('Runaway Roadtrip', '00:10', 9),
    ('Landed Gentry', '00:10', 9),
    ('Determinant', '00:10', 10),
    ('Cricket Club', '00:10', 11),
    ('Drop Tower', '00:10', 11),
    ('Gettysburg Address', '00:10', 11),
    ('Crown of the Netherlands', '00:10', 11),
    ('Presidential Cup', '00:10', 12),
    ('Rock of Ages', '00:10', 12),
    ('Four Decades', '00:10', 12),
    ('Blackbirds', '00:10', 12),
    ('The Standard of Perfection', '00:10', 13),
    ('Lord Jim', '00:10', 14),
    ('Theory of Discovery', '00:10', 15),
    ('Colonial Theater', '00:10', 16),
    ('Paragraph 175', '00:10', 17),
    ('Reformist', '00:10', 18),
    ('Mystery Films', '00:10', 20),
    ('The Conch', '00:10', 21),
    ('All in Good Time', '00:10', 21),
    ('Tony', '00:10', 22),
    ('Train Disaster', '00:10', 22);

INSERT INTO favourites (user_id, album_id) VALUES
    (2, 1);

INSERT INTO album_ratings (user_id, album_id, rating) VALUES
    (1, 1, 10);
