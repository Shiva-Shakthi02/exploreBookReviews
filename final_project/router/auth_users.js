const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
let book = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
  };
  

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const accessToken = jwt.sign(
      { username: username },
      'access', // Secret key
      { expiresIn: '1h' }
    );
  
    return res.status(200).json({ message: "User logged in", token: accessToken });
  });
  
  

// Add a book review
 
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
  
    // Step 3: Get JWT token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Token missing" });
    }
  
    // Step 4: Decode token to get username
    let username;
    try {
      const decoded = jwt.verify(token, 'access');  // secret must match login
      username = decoded.username;
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  
    // Step 5: Check if book exists
    if (!book[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Step 6: Add/Update review
    if (!book[isbn].reviews) {
      book[isbn].reviews = {};
    }
  
    book[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully" });
  });
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (book[isbn] && book[isbn].reviews[username]) {
      delete book[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }
  
    return res.status(404).json({ message: "Review not found for user" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
