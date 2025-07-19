const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({message: "Username already exists"});
    }
  
    users.push({username, password});
    return res.status(200).json({message: "User registered successfully"});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const results = [];
  
    for (let isbn in books) {
      if (books[isbn].author === author) {
        results.push(books[isbn]);
      }
    }
  
    return res.status(200).json(results);
  });
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const results = [];
  
    for (let isbn in books) {
      if (books[isbn].title === title) {
        results.push(books[isbn]);
      }
    }
  
    return res.status(200).json(results);
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
  });
  

module.exports.general = public_users;
