CREATE DATABASE IF NOT EXISTS library;

USE library;

-- Tworzenie tabel
CREATE TABLE IF NOT EXISTS book(
    id_book INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    genre VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    description TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS reader (
    id_reader INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL
    );
CREATE TABLE IF NOT EXISTS borrowing (
    id_borrow INT AUTO_INCREMENT PRIMARY KEY,
    borrow_date DATE NOT NULL,
    return_date DATE,
    id_reader INT NOT NULL,
    id_book INT NOT NULL,
    FOREIGN KEY (id_reader) REFERENCES reader(id_reader) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE

);
INSERT INTO book (title, author, publication_year, genre, quantity, description)
VALUES ('Lalka', 'Bolesław Prus', 1890, 'Powieść', 5, 'Opowieść o losach Stanisława Wokulskiego.');

INSERT INTO book (title, author, publication_year, genre, quantity, description)
VALUES ('W pustyni i w puszczy', 'Henryk Sienkiewicz', 1911, 'Powieść przygodowa', 3, 'Historia dzieci porwanych w Afryce.');

INSERT INTO book (title, author, publication_year, genre, quantity, description)
VALUES ('Pan Tadeusz', 'Adam Mickiewicz', 1834, 'Epopeja', 4, 'Ostatni zajazd na Litwie.');

INSERT INTO book (title, author, publication_year, genre, quantity, description)
VALUES ('Quo Vadis', 'Henryk Sienkiewicz', 1896, 'Powieść historyczna', 6, 'Miłość w czasach prześladowań chrześcijan.');

INSERT INTO book (title, author, publication_year, genre, quantity, description)
VALUES ('Dziady', 'Adam Mickiewicz', 1823, 'Dramat romantyczny', 2, 'Dramat poświęcony duchowości i historii Polski.');

INSERT INTO reader (first_name, last_name, email, phone)
VALUES ('Jan', 'Kowalski', 'jan.kowalski@gmail.com', '123456789');

INSERT INTO reader (first_name, last_name, email, phone)
VALUES ('Anna', 'Nowak', 'anna.nowak@gmail.com', '987654321');

INSERT INTO reader (first_name, last_name, email, phone)
VALUES ('Piotr', 'Zawadzki', 'piotr.zawadzki@gmail.com', '555666777');

INSERT INTO reader (first_name, last_name, email, phone)
VALUES ('Ewa', 'Kwiatkowska', 'ewa.kwiatkowska@gmail.com', '444555666');

INSERT INTO reader (first_name, last_name, email, phone)
VALUES ('Marek', 'Wiśniewski', 'marek.wisniewski@gmail.com', '333444555');

INSERT INTO borrowing (borrow_date, return_date, id_reader, id_book)
VALUES ('2024-11-01', '2024-11-15', 1, 1);
INSERT INTO borrowing (borrow_date, return_date, id_reader, id_book)
VALUES ('2024-11-05', '2024-11-20', 2, 2);
INSERT INTO borrowing (borrow_date, return_date, id_reader, id_book)
VALUES ('2024-11-10', '2024-11-25', 3, 3);
INSERT INTO borrowing (borrow_date, return_date, id_reader, id_book)
VALUES ('2024-11-12', '2024-11-22', 4, 4);
INSERT INTO borrowing (borrow_date, return_date, id_reader, id_book)
VALUES ('2024-11-15', NULL, 5, 5);

