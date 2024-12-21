import { useState, useContext, useEffect } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

export default function EditNote() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { noteId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5001/notes/${noteId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch note.");
        }
        return response.json();
      })
      .then((note) => {
        if (note.authorId !== user.id) {
          throw new Error("Access denied.");
        }
        setTitle(note.title);
        setBody(note.body);
      })
      .catch((err) => {
        setError("Failed to load note.");
      });
  }, [noteId, user]);

  const handleUpdateNote = () => {
    if (!title.trim()) {
      setError("Title cannot be empty!");
      return;
    }

    const updatedNote = {
      title,
      body,
      updatedAt: Date.now(),
    };

    fetch(`http://localhost:5001/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update note.");
        }
        return response.json();
      })
      .then(() => {
        navigate("/notes");
      })
      .catch((err) => {
        setError("Failed to update note. Please try again later.");
      });
  };

  return (
    <div>
      <Header />
      <main className="prose mx-auto flex flex-col gap-5 p-5 max-w-md">
        <h1>Edit note</h1>
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
          onClick={handleUpdateNote}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Changes
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
