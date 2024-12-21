import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerSchema = z
    .object({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one digit"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleRegister = () => {
    setError("");

    const result = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      setError(firstError);
      return;
    }

    const newUser = {
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    fetch("http://localhost:5001/users")
      .then((response) => response.json())
      .then((users) => {
        const maxId = users.length
          ? Math.max(...users.map((user) => user.id))
          : 0;

        newUser.id = maxId + 1;

        return fetch("http://localhost:5001/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to register user.");
        }
        return response.json();
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setError("An error occurred during registration. Try again later.");
      });
  };

  return (
    <div className="prose mx-auto flex flex-col gap-5 p-5 max-w-md">
      <h1>Sign up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Sign up
      </button>
      <div className="text-center">
        <p>Already have an account?</p>
        <Link to="/login" className="text-blue-500 hover:text-blue-700">
          Login here
        </Link>
      </div>
    </div>
  );
}
