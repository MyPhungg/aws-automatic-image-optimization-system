import "./MainLayout.css";

import { Outlet, NavLink, useNavigate } from "react-router-dom";

import NavBar from "../components/Navbar/NavBar";
import Footer from "../components/Footer/Footer";

import { useAuth } from "../context/AuthContext";
import { guestMenu, userMenu } from "../data/menu";

function MainLayout() {

    const navigate = useNavigate();

    const {

        user,

        isAuthenticated,

        logout,

    } = useAuth();

    const menus = isAuthenticated ? userMenu : guestMenu;

    function handleLogout() {

        logout();

        navigate("/");

    }

    return (

        <div className="layout">

            <NavBar />

            <div className="layout-body">

                {/* Sidebar */}

                <aside className="sidebar">

                    <div className="sidebar-header">

                        <h2>Image Optimizer</h2>

                    </div>

                    <div className="sidebar-user">

                        {

                            isAuthenticated ?

                            <>

                                <div className="avatar">

                                    {user?.name.charAt(0)}

                                </div>

                                <h4>{user?.name}</h4>

                                <p>{user?.email}</p>

                            </>

                            :

                            <>

                                <div className="avatar">

                                    G

                                </div>

                                <h4>Guest Mode</h4>

                                <p>Not Logged In</p>

                            </>

                        }

                    </div>

                    <nav className="sidebar-menu">

                        {

                            menus.map((item) => (

                                <NavLink

                                    key={item.path}

                                    to={item.path}

                                    className={({ isActive }) =>

                                        isActive

                                            ? "menu-item active"

                                            : "menu-item"

                                    }

                                >

                                    {item.title}

                                </NavLink>

                            ))

                        }

                    </nav>

                    {

                        isAuthenticated &&

                        <button

                            className="logout-button"

                            onClick={handleLogout}

                        >

                            Logout

                        </button>

                    }

                </aside>

                {/* Content */}

                <main className="layout-content">

                    <Outlet />

                </main>

            </div>

            <Footer />

        </div>

    );

}

export default MainLayout;