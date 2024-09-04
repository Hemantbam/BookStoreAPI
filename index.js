import express from "express";
const app = express();
const port = 8080;

app.use(express.json()); //accept the data in json format from clint side

let bookData = [];
let newId = 1;

/**Add a new book to store */
app.post("/books", auth, (req, res) => {
  const { name, category, author, price } = req.body;
  const bookDetails = { id: newId++, name, category, author, price };
  bookData.push(bookDetails);
  res.status(201).send(bookDetails);
});


/**Shows all the book that are available in store */
app.get("/books", (req, res) => {
  if (bookData != 0) {
    res.status(200).send(bookData);
  } else {
    res.send("Sorry book store is empty :(");
  }
});


/**Show the details of the book with the specified id */
app.get("/books/:id", (req, res) => {
  const searchByID = bookData.find(
    (book) => book.id == parseInt(req.params.id)
  );
  if (searchByID != null) {
    res.status(200).send(searchByID);
  } else {
    res.status(404).send("Book not found :( ");
  }
});


/**Update the details of books that are available in store */
app.put("/books/:id", auth, (req, res) => {
  const book_Id_Details = bookData.find(
    (book) => book.id == parseInt(req.params.id)
  );

  const { name, category, author, price } = req.body;
  if (book_Id_Details != null) {
    book_Id_Details.name = name;
    book_Id_Details.category = category;
    book_Id_Details.author = author;
    book_Id_Details.price = price;
    res.status(200).send(book_Id_Details);
  } else {
    res.status(404).send("Book not found :(");
  }
});


/** Remove the book from the store */
app.delete("/books/:id", auth, (req, res) => {
  const bookIndex = bookData.findIndex(
    (book) => book.id == parseInt(req.params.id)
  );
  if (bookIndex >= 0) {
    bookData.splice(bookIndex, 1);
    res.status(200).send("book deleted :) ");
  } else {
    res.status(404).send("Book not found :(");
  }
});


/** A middleware to authenticate the admin user and authorize the post,put,delete functionality only to the user admin */
function auth(req, res, next) {
  if (req.query.user == "admin") {
    console.log("Admin authentication sucessfull :)");
    next();
  } else {
    res.status(403).send("Authintication failed :(");
    console.log("Authentical failed :(");
  }
}

app.listen(port);
