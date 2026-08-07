import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function UserMenu() {
    const { isAuthenticated, user, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (isAuthenticated) {
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
        return (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user?.name && <span className="user-name" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>{user.name}</span>}
                {isAdmin && (
                    <span className="role-badge" style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        ADMIN
                    </span>
                )}
                <button className="logout-button" onClick={handleLogout}>
                    Log out
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