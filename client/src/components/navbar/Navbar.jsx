import { Link } from "react-router-dom";
import useUser from "../../common/hooks/useUser";

const Navbar = () => {
  const { user } = useUser();

  const authItems = [
    {
      id: 1,
      label: "Sign In",
      link: "/signin",
    },
    {
      id: 2,
      label: "Sign Up",
      link: "/signup",
    },
    {
      id: 3,
      label: "Profile",
      link: "/profile",
      loggedIn: true,
    },
    {
      id: 4,
      label: "Sign Out",
      link: "/signout",
      loggedIn: true,
    },
  ];

  const featureItems = [
    {
      id: 1,
      label: "Notes",
      link: "/notes",
      loggedIn: true,
    },
    {
      id: 2,
      label: "Users",
      link: "/users",
      loggedIn: true,
      admin: true,
    },
  ];

  const getFilteredItemsList = (itemsList) => {
    let filteredList = user
      ? itemsList.filter((i) => i.loggedIn)
      : itemsList.filter((i) => !i.loggedIn);

    if (user && !user.isAdmin)
      filteredList = filteredList.filter((i) => !i.admin);

    return filteredList;
  };

  const getItemsList = (itemsList) => {
    return itemsList.map((item) => (
      <li key={item.id} className="nav-item mx-2">
        <Link to={item.link} className="nav-link fw-bolder">
          {item.label}
        </Link>
      </li>
    ));
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid d-flex flex-row justify-content-start">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            Notes
          </Link>
          <div className="links-container flex-grow-1">
            <div className="d-flex flex-row justify-content-between">
              <div className="nav-features">
                <ul className="navbar-nav d-flex flex-row">
                  {getItemsList(getFilteredItemsList(featureItems))}
                </ul>
              </div>
              <div className="nav-auth">
                <ul className="navbar-nav d-flex flex-row">
                  {getItemsList(getFilteredItemsList(authItems))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
