import { useContext } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGoToNotes = () => {
    navigate("/notes");
  };

  return (
    <div>
      <Header />
      <main className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">About me</h1>

        <p className="text-lg mb-2">Email: {user.email}</p>
        <p className="text-lg mb-4">
          Date sign up: {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <button
          onClick={handleGoToNotes}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Go to notes
        </button>
      </main>
    </div>
  );
}
