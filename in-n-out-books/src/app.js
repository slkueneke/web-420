/*
  Name: Shannon Kueneke
  Date: 01-27-2026
  File: src/app.js
  Description: In-N-Out Books App
*/

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const books = require('../database/books');

//create an express app
const app = express();

//parse incoming req as json payloads
app.use(express.json());
//parse incoming urlencoded payloads
app.use(express.urlencoded({extended:true}));

//static files (css, js, img)
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", async(req, res, next)=> {
  //HTML content for the landing page
  const html = `
<html>
  <head>
    <title>In-N-Out Books</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/stylesheets/styles.css">
  </head>
  <body>
    <nav>
      <div>
          <div id="logo">
            <img src="/images/logo_nav.png" alt="In-N-Out Books" />
          </div>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/my/books">My Books</a></li>
            <li><a href="/browse">Browse Books</a></li>
          </ul>
        </div>
    </nav>
    <div class="container">
      <header>
       <img src="/images/logo.png" alt="In-N-Out Books" />
       <section id="about">
          <h3>Welcome to In-N-Out Books!</h3>
          <p>
            The idea of the In-N-Out-Books was inspired by the love of books and
            the desire to create a platform where users can manage their own
            collection of books. Whether you are an avid reader who wants to
            keep track of the books you've read, or a book club organizer who
            needs to manage a shared collection, In-N-Out-Books is designed to
            cater to your needs.
          </p>
        </section>
      </header>
      <main>

        <section id="topBooks">
          <h3>Most Popular Books</h3>

          <div>
            <div class="book">
              <div class="bookImage">
                <img src="/images/books/book_theHousemaid.jpg" alt="The Housemaid" >
              </div>
              <div class="bookInfo">
                <p class="bookTitle">The Housemaid</p>
                <p class="bookAuthor">Freida McFadden</p>
                <p class="bookRating">4.27 / 5</p>
                <p class="bookDesc">Every day I clean the Winchesters' beautiful house top to bottom. I collect their daughter from school. And I cook a delicious meal for the whole family before heading up to eat alone in my tiny room on the top floor.
                  <br>
                I try to ignore how Nina makes a mess just to watch me clean it up. How she tells strange lies about her own daughter. And how her husband Andrew seems more broken every day. But as I look into Andrew's handsome brown eyes, so full of pain, it's hard not to imagine what it would be like to live Nina's life. The walk-in closet, the fancy car, the perfect husband.
                  <br>
                I only try on one of Nina's pristine white dresses once. Just to see what it's like. But she soon finds out… and by the time I realize my attic bedroom door only locks from the outside, it's far too late.
                  <br>
                But I reassure myself: the Winchesters don't know who I really am.
                  <br>
                They don't know what I'm capable of...</p>
                <p class="bookMore"><a href="#">View Book Details</a></p>
                <div class="addBookCTA"><a href="#">Add to My List</a></div>
              </div>
            </div>

            <div class="book">
              <div class="bookImage">
                <img src="/images/books/book_theCorrespondent.jpg" alt="The Correspondent" >
              </div>
              <div class="bookInfo">
                <p class="bookTitle">The Correspondent</p>
                <p class="bookAuthor">Virginia Evans</p>
                <p class="bookRating">4.56 / 5</p>
                <p class="bookDesc">Sybil Van Antwerp has throughout her life used letters to make sense of the world and her place in it. Most mornings, around half past ten, Sybil sits down to write letters—to her brother, to her best friend, to the president of the university who will not allow her to audit a class she desperately wants to take, to Joan Didion and Larry McMurtry to tell them what she thinks of their latest books, and to one person to whom she writes often yet never sends the letter.
                  <br>
                booksSybil expects her world to go on as it always has—a mother, grandmother, wife, divorcee, distinguished lawyer, she has lived a very full life. But when letters from someone in her past force her to examine one of the most painful periods of her life, she realizes that the letter she has been writing over the years needs to be read and that she cannot move forward until she finds it in her heart to offer forgiveness.</p>
                <p class="bookMore"><a href="#">View Book Details</a></p>
                <div class="addBookCTA"><a href="#">Add to My List</a></div>
              </div>
            </div>

            <div class="book">
              <div class="bookImage">
                <img src="/images/books/book_atmosphere.jpg" alt="Atmosphere" >
              </div>
              <div class="bookInfo">
                <p class="bookTitle">Atmosphere</p>
                <p class="bookAuthor">Taylor Jenkins Reid</p>
                <p class="bookRating">4.34 / 5</p>
                <p class="bookDesc">
                  Joan Goodwin has been obsessed with the stars for as long as she can remember. Thoughtful and reserved, Joan is content with her life as a professor of physics and astronomy at Rice University and as aunt to her precocious niece, Frances. That is, until she comes across an advertisement seeking the first women scientists to join NASA's space shuttle program. Suddenly, Joan burns to be one of the few people to go to space.
                    <br>
                  Selected from a pool of thousands of applicants in the summer of 1980, Joan begins training at Houston's Johnson Space Center, alongside an exceptional group of fellow candidates: Top Gun pilot Hank Redmond and scientist John Griffin, who are kind and easygoing even when the stakes are highest; mission specialist Lydia Danes, who has worked too hard to play nice; warmhearted Donna Fitzgerald, who is navigating her own secrets; and Vanessa Ford, the magnetic and mysterious aeronautical engineer, who can fix any engine and fly any plane.
                    <br>
                  As the new astronauts become unlikely friends and prepare for their first flights, Joan finds a passion and a love she never imagined. In this new light, Joan begins to question everything she thinks she knows about her place in the observable universe.
                    <br>
                  Then, in December of 1984, on mission STS-LR9, it all changes in an instant.
                    <br>
                  Fast-paced, thrilling, and emotional, Atmosphere is Taylor Jenkins Reid at her best: transporting readers to iconic times and places, creating complex protagonists, and telling a passionate and soaring story about the transformative power of love—this time among the stars.
                </p>
                <p class="bookMore"><a href="#">View Book Details</a></p>
                <div class="addBookCTA"><a href="#">Add to My List</a></div>
              </div>
            </div>
          </div>
          <p><a href="#">View more popular books</a></p>
        </section>

        <footer>
          <div>
            <h4>Need Support?</h4>
            <p>
              Email
              <a href="mailto:help@innoutbooks.com">help@innoutbooks.com</a> and
              we will respond between the hours of 9am - 5pm PT.
            </p>
          </div>
        </footer>
      </main>
    </div>
  </body>
</html>

  `; //end HTML content for the landing page

  res.send(html); //sends the html content to the client
});

//get endpoint for /api/books that returns an array of all books
app.get('/api/books', async(req, res, next)=> {
  try {
    const allBooks = await books.find(); //logs all books
    res.send(allBooks); //sends response with all books
  } catch(err) {
    console.error("Error: ", err.message); //logs err msg
    next(err); //passes err to next middleware
  }
});

//get endpoint for /api/books/:id (single book by id)
app.get('/api/books/:id', async(req, res, next)=> {
  try {
    //check if id is a number
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, 'Book ID must be a number'));
    }

    const book = await books.findOne({id: Number(req.params.id)});
    console.log("Book: ", book);
    res.send(book);
  } catch(err) {
    console.error("Error: ", err.message);
    next(err);
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

module.exports = app;

