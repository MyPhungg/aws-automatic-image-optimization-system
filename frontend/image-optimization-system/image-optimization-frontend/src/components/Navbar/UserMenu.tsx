import {Link} from 'react-router-dom'

function UserMenu() {
    const isLoggin = false; 
    if (isLoggin) {
        return (
            <div className="user-menu"> 
                <button className="profile-button">
                    Tan
                </button>
            </div>
        )
    }
    return (
       <Link to="/login" className="login-button">
            Login
       </Link>

    )
}
export default UserMenu