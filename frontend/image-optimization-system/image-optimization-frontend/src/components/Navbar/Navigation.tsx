import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { guestMenu, userMenu } from '../../data/menu';

function Navigation() {
    const { isAuthenticated } = useAuth();
    const menus = isAuthenticated ? userMenu : guestMenu;

    return (
        <nav className="navigation">
            {menus.map((item) => (
                <NavLink key={item.path} to={item.path} className="nav-link">
                    {item.title}
                </NavLink>
            ))}
        </nav>
    )
}
export default Navigation;