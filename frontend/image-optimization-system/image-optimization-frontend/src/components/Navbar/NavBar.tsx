import Logo from './Logo'
import Navigation from './Navigation'
import UserMenu from './UserMenu'

import './Navbar.css'


function NavBar() {
    return (
        <header className="navbar">
            <div className='navbar-container'>
                <Logo />
                <Navigation />
                <UserMenu />
            </div>
        </header>
    )
}
export default NavBar