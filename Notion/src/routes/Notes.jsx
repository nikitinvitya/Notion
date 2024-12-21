import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Notes() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5001/notes?authorId=${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch notes.");
        }
        return response.json();
      })
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [user]);

  const handleDeleteNote = (noteId) => {
    fetch(`http://localhost:5001/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete note.");
        }
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      })
      .catch((err) => {});
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div>Loading notes...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="prose mx-auto flex flex-col gap-5 p-5 max-w-md">
        <h1 className="text-center">My Notes</h1>
        <button
          onClick={() => navigate("/create-note")}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Create New Note
        </button>
        {notes.length === 0 ? (
          <p>No notes yet!</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <li
                key={note.id}
                onClick={() => navigate(`/view-note/${note.id}`)}
                className="border p-2 rounded flex justify-between items-center hover:bg-gray-100 cursor-pointer max-w-full"
              >
                <div className="flex flex-col w-full">
                  <h2 className="font-bold">{note.title}</h2>
                  <small className="text-gray-500">
                    Created at: {new Date(note.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-note/${note.id}`);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✍️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
