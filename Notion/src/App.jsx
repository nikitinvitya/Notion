import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Register from "./routes/Register";
import Notes from "./routes/Notes";
import CreateNote from "./routes/CreateNote";
import EditNote from "./routes/EditNote";
import ViewNote from "./routes/ViewNote";
import NotFound from "./routes/NotFound";
import UserContextProvider from "./components/UserContextProvider";
import RequireAuth from "./components/RequireAuth";

const router = createBrowserRouter([
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: "notes",
    element: (
      <RequireAuth>
        <Notes />
      </RequireAuth>
    ),
  },
  {
    path: "create-note",
    element: (
      <RequireAuth>
        <CreateNote />
      </RequireAuth>
    ),
  },
  {
    path: "edit-note/:noteId",
    element: (
      <RequireAuth>
        <EditNote />
      </RequireAuth>
    ),
  },
  {
    path: "view-note/:noteId",
    element: (
      <RequireAuth>
        <ViewNote />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}
