import express, { json } from "express";
import db from "./dbConn.js";

const app = express();
const port = 8080;
import fs from "fs";
app.use(express.json()); //accept the data in json format from clint side

//-------------------------------------------------------------------------------

/**Add a new book to store */

app.post("/books", auth, async (req, res) => {
  const { name, category, author, price } = req.body;
  console.log(req.body);
  try {
    await db.query(
      "INSERT INTO book_Details (book_Name, book_Category, book_Author, book_Price) VALUES (?,?,?,?)",
      [name, category, author, price]
    );
    res.status(200).send({ name, category, author, price });
    // addDataToFile(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error in adding book to database :(");
  }
});

//-------------------------------------------------------------------------------

/**Shows all the book that are available in store */

app.get("/books", async (req, res) => {
  try {
    const [db_getBookDetails] = await db.query("Select * from book_Details");
    if (db_getBookDetails.length > 0) {
      res.status(200).send(db_getBookDetails);
    } else {
      res.send(404).send("No books are available:(");
    }
  } catch (err) {
    res.send(404).send("Book Not found :(");
  }
});

//-------------------------------------------------------------------------------

/**Show the details of the book with the specified id */

app.get("/books/:id", async (req, res) => {
  const bookID = parseInt(req.params.id);
  try {
    const [db_getBookDetailsByID] = await db.query(
      "select * from book_Details where book_ID=?",
      [bookID]
    );
    if (db_getBookDetailsByID.length > 0) {
      res.status(200).send(db_getBookDetailsByID);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (err) {
    res.status(404).send("Book not found :(");
  }
});

//-------------------------------------------------------------------------------

/**Update the details of books that are available in store */

app.put("/books/:id", auth, async (req, res) => {
  const book_ID = parseInt(req.params.id);
  const { name, category, author, price } = req.body;
  try {
    await db.query(
      "update book_Details set book_Name=?, book_Category=?, book_Author=?, book_Price=? where book_ID=?",
      [name, category, author, price, book_ID]
    );
    res
      .status(200)
      .send(`Book Details updated with ${JSON.stringify(req.body)}`);
  } catch (err) {
    res.status(404).send("Book not found :(");
  }
});

//-------------------------------------------------------------------------------

/** Remove the book from the store */

app.delete("/books/:id", auth, async (req, res) => {
  const book_ID = parseInt(req.params.id);
  try {
    await db.query("delete from book_Details where book_ID=?", book_ID);
    res.status(200).send(`Book deleted with book_ID=${book_ID}`);
  } catch (err) {
    console.log(err);
    res.status(404).send("Book not found :(");
  }
});

//-------------------------------------------------------------------------------

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

/**Function to add the data to the file when the admin add the book */
// function addDataToFile(bookDetails) {
//   // const fileData = JSON.stringify(bookDetails, null, 3);
//   fs.writeFile("bookList.txt", [bookDetails], (err) => {
//     if (err) {
//       console.log("error");
//     } else {
//       console.log("File created");
//     }
//   });
// }

// /**Function to add the data to the txt file when the book details are updated */
// function updateFileData(book_Id_Details) {
//   // const fileData = JSON.stringify(book_Id_Details, null, 3);
//   fs.appendFile("bookList.txt", book_Id_Details, (err) => {
//     if (err) {
//       console.log("Error");
//     } else {
//       console.log("File edited");
//     }
//   });
// }

app.listen(port);
