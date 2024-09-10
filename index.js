import express, { json } from "express";
import db from "./config/dbConn.js";
import auth from "./middleware/authentication.js";
const app = express();
const port = 8080;
app.use(express.json());

//-------------------------------------------------------------------------------

/**Add a new book to the store database*/

app.post("/books", auth, async (req, res) => {
  const { name, category, author, price } = req.body;
  console.log(req.body);
  try {
    if (
      price.trim() != "" &&
      name.trim() != "" &&
      category.trim() != "" &&
      author.trim() != "" &&
      parseInt(price) >= 0
    ) {
      await db.query(
        "INSERT INTO bookdetails (bookName, bookCategory, bookAuthor, bookPrice) VALUES (?,?,?,?)",
        [name, category, author, price]
      );
      const [userNewData] = await db.query(
        "Select bookId from bookdetails order by bookId DESC limit 1"
      );
      res.status(200).json({
        status: "200",
        message: "Book Added successfully",
        data: `Book Id ${userNewData[0].bookId}`,
      });
    } else {
      res.status(422).json({
        status: "422",
        message: "Unprocessable entity",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: "An Unexpected Error occured",
    });
  }
});

//-------------------------------------------------------------------------------

/**Shows all the book that are available in store database*/

app.get("/books", async (req, res) => {
  try {
    const [db_getBookDetails] = await db.query("Select * from bookdetails");
    if (db_getBookDetails.length > 0) {
      res.status(200).json({
        bookDetails: db_getBookDetails,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Book not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: "An Unexpected Error occured",
    });
  }
});

//-------------------------------------------------------------------------------

/**Show the details of the book with the specified id from the database*/

app.get("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const [db_getBookDetailsByID] = await db.query(
      "select * from bookdetails where bookId=?",
      [bookId]
    );
    if (db_getBookDetailsByID.length > 0) {
      res.status(200).json({
        bookDetails: db_getBookDetailsByID,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Book not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: "An Unexpected Error occured",
    });
  }
});

//-------------------------------------------------------------------------------

/**Update the details of books with a book unique id that are available in store database */

app.put("/books/:id", auth, async (req, res) => {
  const bookId = parseInt(req.params.id);
  const { name, category, author, price } = req.body;

  try {
    if (
      price.trim() != "" &&
      name.trim() != "" &&
      category.trim() != "" &&
      author.trim() != "" &&
      parseInt(price) >= 0
    ) {
      const [checkBookDetails] = await db.query(
        "select * from bookdetails where bookId=?",
        [bookId]
      );
      if (checkBookDetails.length > 0) {
        await db.query(
          "update bookdetails set bookName=?, bookCategory=?, bookAuthor=?, bookPrice=? where bookId=?",
          [name, category, author, price, bookId]
        );
        res.status(200).json({
          status: "200",
          message: "Book Updated Successfully",
        });
      } else {
        res.status(404).json({
          status: "404",
          message: "Book not found",
        });
      }
    } else {
      res.status(422).json({
        status: "422",
        message: "Unprocessable entity",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: "An Unexpected Error occured",
    });
  }
});

//-------------------------------------------------------------------------------

/** Remove the book data from the store database */

app.delete("/books/:id", auth, async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const [checkBookDetails] = await db.query(
      "Select * from bookdetails where bookId=?",
      bookId
    );
    if (checkBookDetails.length > 0) {
      await db.query("delete from bookdetails where bookId=?", [bookId]);
      res.status(200).json({
        status: "200",
        message: "Book Deleted successfully",
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Book not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: "An Unexpected Error occured",
    });
  }
});

//-------------------------------------------------------------------------------

app.listen(port);
