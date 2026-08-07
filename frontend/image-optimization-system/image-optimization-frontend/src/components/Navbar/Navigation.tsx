import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMenuItems } from '../../data/menu';

function Navigation() {
    const { isAuthenticated, user } = useAuth();
    const menus = getMenuItems(isAuthenticated, user?.role);

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