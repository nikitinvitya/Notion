import { useContext, useState } from "react";
import { UserContext } from "../components/UserContextProvider";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one digit"),
  });

  function handleLogin() {
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      setError(firstError);
      return;
    }

    const query = new URLSearchParams({ email, password }).toString();

    fetch(`http://localhost:5001/users?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при запросе");
        }
        return response.json();
      })
      .then((users) => users[0])
      .then((user) => {
        if (user) {
          userContext.onChange(user);
          navigate("/");
        } else {
          setError("Invalid user");
        }
      })
      .catch(() => setError("An error occurred during login"));
  }

  return (
    <div className="prose mx-auto flex flex-col gap-5 p-5 max-w-md">
      <h1>Log in</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Log in
      </button>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="text-center">
        <p>Don't have an account?</p>
        <Link to="/register" className="text-blue-500 hover:text-blue-700">
          Sign up here
        </Link>
      </div>
    </div>
  );
}
