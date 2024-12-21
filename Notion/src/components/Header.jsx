import { useContext } from "react";
import { UserContext } from "./UserContextProvider";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, onChange } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    onChange(null);
    navigate("/login");
  };

  const handleNavigateToHome = () => {
    navigate("/");
  };

  const handleNavigateToNotes = () => {
    navigate("/notes");
  };

  return (
    <header className="flex justify-between items-center bg-white-800 text-black p-4">
      <div>
        <span className="font-bold">Hello, {user.email}</span>
      </div>
      <div className="flex gap-4">
        <button onClick={handleNavigateToHome} className="hover:underline">
          Home
        </button>
        <button onClick={handleNavigateToNotes} className="hover:underline">
          Notes
        </button>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-white-150 px-4 py-2 rounded hover:bg-red-600"
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
