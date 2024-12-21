import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function ViewNote() {
  const { user } = useContext(UserContext);
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5001/notes/${noteId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch note.");
        }
        return response.json();
      })
      .then((data) => {
        setNote(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load note.");
        setLoading(false);
      });
  }, [user, noteId]);

  const handleDeleteNote = () => {
    fetch(`http://localhost:5001/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete note.");
        }
        navigate("/notes");
      })
      .catch((err) => {
        setError("Failed to delete note.");
      });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div>Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="prose mx-auto flex flex-col gap-5 p-5 max-w-md">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-note/${note.id}`)}
              className="text-blue-500 hover:text-blue-700"
              title="Edit Note"
            >
              ✍️
            </button>
            <button
              onClick={handleDeleteNote}
              className="text-red-500 hover:text-red-700"
              title="Delete Note"
            >
              🗑️
            </button>
          </div>
        </div>
        <p>{note.body}</p>
        <button
          onClick={() => navigate("/notes")}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Back to notes
        </button>
      </main>
    </div>
  );
}
