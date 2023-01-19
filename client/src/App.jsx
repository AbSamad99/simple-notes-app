import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Pages
import Home from "./pages/home/Home";
import SignUp from "./pages/auth/signup/SignUp";
import SignIn from "./pages/auth/signin/SignIn";
import SignOut from "./pages/auth/signout/SignOut";
import UsersList from "./pages/user/user-list/UsersList";
import NotesList from "./pages/note/note-list/NotesList";
import NotificationProvider from "./common/providers/NotificationProvider";
import Notification from "./components/notification/Notification";
import UserProvider from "./common/providers/UserProvider";
import VerifyEmail from "./pages/auth/verify-email/VerifyEmail";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import Loader from "./components/loader/Loader";
import LoaderProvider from "./common/providers/LoaderProvider";
import CreateNote from "./pages/note/create-note/CreateNote";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/edit-profile/EditProfile";
import EditPassword from "./pages/auth/edit-password/EditPassword";
import CreateUser from "./pages/user/create-user/CreateUser";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <LoaderProvider>
          <NotificationProvider>
            <Navbar />
            <Notification />
            <Loader>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signout" element={<SignOut />} />
                <Route path="/verify-email/:id" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id" element={<ResetPassword />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/notes" element={<NotesList />} />
                <Route path="/notes/create" element={<CreateNote />} />
                <Route path="/notes/edit/:id" element={<CreateNote />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/users/edit/:id" element={<CreateUser />} />
                <Route
                  path="/profile/edit-password"
                  element={<EditPassword />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Loader>
          </NotificationProvider>
        </LoaderProvider>
      </UserProvider>
    </div>
  );
}

export default App;
