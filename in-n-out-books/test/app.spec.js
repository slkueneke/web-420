/*
Author: Shannon Kueneke
Date: Feb 3, 2026
File: test/app.spec.js
Desc: Jest tests for In-n-Out Books app
*/

const app = require('../src/app');
const request = require('supertest');

describe('In-N-Out Books Jest Tests', () => {
  it('should return an array of all books', async()=> {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book)=> {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
    });
  });

  it('should return a single book', async() => {
    const res = await request(app).get('/api/books/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'The Fellowship of the Ring');
    expect(res.body).toHaveProperty('author', 'J.R.R. Tolkien');
  });

  it('should return a 400 error if the id is not a number', async() => {
    const res = await request(app).get("/api/books/foo");
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Book ID must be a number");
  });
});