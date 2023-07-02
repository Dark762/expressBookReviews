//This contains the skeletal implementations for the routes which an authorized user can access.
const express = require('express');
const regd_users = express.Router();
const users = require('./general').users;
const books = require('./general').books;
const jwt = require('jsonwebtoken');


regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    var x = __dirname;
    var y = __filename;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (autheticatedUser(username, password)) {
        let accesstoken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = { accesstoken, username };

        res.set('Authorization', accesstoken);

        return res.status(200).send("User Successfully logged in");

    } else {
        return res.status(208).json({ message: "Invalid Login" });
    }


});

const autheticatedUser = (username, password) => {
    let validateUsers = users.filter((user) => {
        return user.username == username;
    });

    if (validateUsers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}


regd_users.put('/auth/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = req.body.review;


    let book = books.filter((book) => {
        if (book.isbn === isbn) {
            return book;
        }
    });

    if (book.length > 0) {

        username = req.session.authorization['username'];

        book[0].reviews.push(
            { reviewer: username, review: review  }
        );


        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    let book = books.filter((book) => {
        if (book.isbn === isbn) {
            return book;
        }
    });

    if (book.length > 0) {

        username = req.session.authorization['username'];

        book[0].reviews.forEach((review,index) => {
            if (review.reviewer == username){
                book[0].reviews.splice(index,1);
            }
        });


        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports = { authenticated: regd_users }