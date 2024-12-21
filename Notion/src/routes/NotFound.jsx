import { useContext } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="prose mx-auto flex flex-col items-center justify-center h-screen text-center p-5">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-lg">Page not found</p>
      <button
        onClick={() => navigate(user ? "/" : "/login")}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {user ? "Go to Home" : "Go to Login"}
      </button>
    </div>
  );
}
