import { useState, useContext } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSaveNote = () => {
    if (!title.trim()) {
      setError("Title cannot be empty!");
      return;
    }

    const newNote = {
      authorId: user.id,
      title,
      body,
      createdAt: Date.now(),
    };

    fetch("http://localhost:5001/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save note.");
        }
        return response.json();
      })
      .then(() => {
        navigate("/notes");
      })
      .catch((err) => {
        setError("Failed to save note. Please try again later.");
      });
  };

  return (
    <div>
      <Header />
      <main className="prose mx-auto flex flex-col gap-5 p-5 max-w-md">
        <h1>Create new note</h1>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Write your note here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border p-2 rounded w-full"
          rows={5}
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          onClick={handleSaveNote}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Note
        </button>
        <button
          onClick={() => navigate("/notes")}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </main>
    </div>
  );
}
