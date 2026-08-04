import {NavLink} from 'react-router-dom'

function Navigation() {
    return (
        <nav className="navigation">
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/upload" className="nav-link">Upload</NavLink>
            <NavLink to="/my-images" className="nav-link">My Images</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            <NavLink to="/login" className="nav-link">Login</NavLink>
        </nav>
    )
}
export default Navigation