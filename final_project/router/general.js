//This contains the skeletal implementations for the routes which a general user can access.
const express = require('express');
const public_users = express.Router();
const axios = require("axios");


let users = [];

let books = [];

books.push({ "title": "Harry Potter 1", "isbn": "ABC123", "author": "Joanne Rowling", "reviews": [] });
books.push({ "title": "Harry Potter 2", "isbn": "EFG123", "author": "Joanne Rowling", "reviews": [] });
books.push({ "title": "Harry Potter 3", "isbn": "HIJ123", "author": "Joanne Rowling", "reviews": [] });
books.push({ "title": "Harry Potter 4", "isbn": "KLM123", "author": "Joanne Rowling", "reviews": [] });

public_users.get('/', async function (req, res) {
    var result = await res.status(200).json(books);

    return result;
});



public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    let book = await books.filter((book) => {
        if (book.isbn === isbn) {
            return book;
        }
    });

    if (book.length > 0) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }

});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    let book = books.filter((book) => {
        if (book.author === author) {
            return book;
        }
    });

    if (book.length > 0) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found by author" });
    }
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    let book = books.filter((book) => {
        if (book.title === title) {
            return book;
        }
    });

    if (book.length > 0) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found by tittle" });
    }
});


public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    let book = books.filter((book) => {
        if (book.isbn === isbn) {
            return book;
        }
    });

    if (book.length > 0) {
        return res.status(200).json(book[0].reviews);
    } else {
        return res.status(404).json({ message: "review not found by this isbn" });
    }
});


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    if (!username || !password) {
        return res.status(404).json({ message: "Unable to register user." });
    } else {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });

            return res.status(200).json({ message: "User Successfully registred. now you can login" });
        } else {
            return res.status(404).json({ message: "you can't create this user because it exists." });
        }
    }

});


const doesExist = (username) => {
    let usersWithSameName = users.filter((user) => {
        return user.username == username;
    });

    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}


module.exports = { general: public_users, users: users, books: books };