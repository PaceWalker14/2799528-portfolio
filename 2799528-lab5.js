const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store (must start empty)
let books = [];

const STUDENT_NUMBER = '2799528';

function findBookIndexById(id) 
{
    return books.findIndex((book) => book.id === id);
}

function hasRequiredDetailFields(detail) 
{
    return(
        detail &&
        detail.id !== undefined &&
        detail.author !== undefined &&
        detail.genre !== undefined &&
        detail.publicationYear !== undefined
    );
}



function normalizeBook(book)
{
    return {
        id: String(book.id),
        title: book.title,
        details: Array.isArray(book.details) ? book.details : []
    };
}


//get requests
app.get('/whoami', (req, res) => {
    res.status(200).json({ studentNumber: STUDENT_NUMBER });
});

app.get('/books', (req, res) => {
    books = books.map((book) => normalizeBook(book));
    res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find((item) => item.id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    return res.status(200).json(normalizeBook(book));
});





//post requests
app.post('/books', (req, res) => {
    const { id, title, details } = req.body;

    if (!id || !title) 
        {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBook = normalizeBook({
        id: String(id),
        title,
        details: Array.isArray(details) ? details : []
    });

    books.push(newBook);
    return res.status(201).json(newBook);
});

app.post('/books/:id/details', (req, res) => {
    const book = books.find((item) => item.id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (!hasRequiredDetailFields(req.body)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const detail = {
        id: String(req.body.id),
        author: req.body.author,
        genre: req.body.genre,
        publicationYear: req.body.publicationYear
    };

    book.details = Array.isArray(book.details) ? book.details : [];

    book.details.push(detail);
    return res.status(201).json(normalizeBook({ ...book, details: [...book.details] }));
});





// put requests
app.put('/books/:id', (req, res) => {
    const index = findBookIndexById(req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, details } = req.body;

    if (title === undefined && details === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (title !== undefined) {
        books[index].title = title;
    }

    if (details !== undefined) {
        if (!Array.isArray(details)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        books[index].details = details;
    }

    return res.status(200).json(normalizeBook(books[index]));
});





//delete requests
app.delete('/books/:id', (req, res) => {
    const index = findBookIndexById(req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = normalizeBook(books[index]);
    books.splice(index, 1);
    return res.status(200).json(deletedBook);
});



app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find((item) => item.id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book or detail not found' });
    }

    if (!Array.isArray(book.details)) {
        return res.status(404).json({ error: 'Book or detail not found' });
    }

    const detailIndex = book.details.findIndex((detail) => detail.id === req.params.detailId);

    if (detailIndex === -1) {
        return res.status(404).json({ error: 'Book or detail not found' });
    }

    const removedDetail = book.details[detailIndex];
    book.details.splice(detailIndex, 1);
    return res.status(200).json(removedDetail);
});





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});