// cutom hooks
import useUser from "../../common/hooks/useUser";

// custom css
import "./Home.css";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="container mt-2">
      <h2 className="home-heading">
        {user ? `Welcome back ${user.firstName}` : "Hi there!"}
      </h2>
      <span className="home-sub-heading">
        {user
          ? "Click on the links in the navbar."
          : "Sign in to start using the app."}
      </span>
    </div>
  );
};

export default Home;
