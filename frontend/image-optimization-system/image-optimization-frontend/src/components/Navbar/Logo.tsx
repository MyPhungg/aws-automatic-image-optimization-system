import {Link} from 'react-router-dom'

function Logo() {
    return (
        <Link to="/" className="logo">
            <span className="logo-main">IMGO</span>
            <span className="logo-text">Image Optimization System</span>
        </Link>
    );
}
export default Logo;