import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  }

  const addBook = async () => {
    const bookData = {
      title,
      release_year: Number(releaseYear),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/create/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();
      setBooks((prev) => [...prev, data]);

      setTitle("")
      setReleaseYear("")

    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      setBooks((prev) =>
        prev.map((book) =>
          book.id === pk ? data : book
        )
      );

      setNewTitle("");

    } catch (err) {
      console.log(err);
    }
  };

  const deleteBook = async (pk) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/books/${pk}/`, {
        method: "DELETE",
      });

      setBooks((prev) => prev.filter((book) => book.id !== pk));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h1>Book Website</h1>

      <div className="add-form">
        <input
          type="text"
          placeholder="Book Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Release Year..."
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />

        <button onClick={addBook}>Add Book</button>
      </div>

      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book.id}>

            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Release Year:</strong> {book.release_year}</p>

            <input
              type="text"
              placeholder="New Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="buttons">
              <button onClick={() => updateTitle(book.id, book.release_year)}>
                Change Title
              </button>

              <button className="delete"
                onClick={() => deleteBook(book.id)}>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default App