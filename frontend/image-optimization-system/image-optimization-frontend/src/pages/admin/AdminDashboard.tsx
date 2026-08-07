import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AdminUser } from "../../types/Admin";
import { userService } from "../../services/userService";
import "./AdminDashboard.css";

interface SelectedUserDetails {
    userId: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role?: string;
    status?: string;
    createdAt?: string;
    lastLogin?: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<keyof AdminUser>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Modal State
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<SelectedUserDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.getAllUsers();
            setUsers(response.data || []);
        } catch (err: any) {
            console.error("Failed to load user list:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch data from backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserClick = async (user: AdminUser) => {
        setSelectedUser(user);
        setSelectedDetails(null);
        setLoadingDetails(true);
        try {
            const res = await userService.getUserById(user.userId);
            setSelectedDetails(res.data);
        } catch (err) {
            console.warn("Could not fetch detailed profile for user:", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Metrics calculations
    const totalUsers = users.length;
    const totalBatches = users.reduce((sum, u) => sum + Number(u.totalBatches || 0), 0);
    const totalImages = users.reduce((sum, u) => sum + Number(u.totalImages || 0), 0);

    // Search filter
    const filteredUsers = users.filter(u =>
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.userId || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        const normalizedA = typeof valA === "number" ? valA : String(valA ?? "");
        const normalizedB = typeof valB === "number" ? valB : String(valB ?? "");
        if (normalizedA < normalizedB) return sortOrder === "asc" ? -1 : 1;
        if (normalizedA > normalizedB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof AdminUser) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof AdminUser }) => {
        if (sortKey !== columnKey) return null;
        return <span style={{ marginLeft: 4 }}>{sortOrder === "asc" ? "↑" : "↓"}</span>;
    };

    return (
        <div className="admin-root">
            <header className="admin-topbar">
                <div className="admin-topbar-inner">
                    <Link to="/admin" className="admin-logo">
                        <span className="admin-logo-main">IMGO</span>
                        <span className="admin-logo-sub">Image Optimization System</span>
                        <span className="admin-logo-badge">Admin</span>
                    </Link>
                    <div className="admin-topbar-right">
                        <button className="btn-secondary" onClick={fetchUsers} disabled={loading}>
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            <main className="admin-body">
                <div className="admin-page-header">
                    <span className="admin-tag">Admin Dashboard</span>
                    <h1>System User Management</h1>
                    <p>Real-time data synchronized directly from backend controllers (DynamoDB & S3).</p>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                        <div className="stat-sub">Registered system users</div>
                    </div>
                    <div className="stat-card green">
                        <div className="stat-value">{totalBatches}</div>
                        <div className="stat-label">Total Batches</div>
                        <div className="stat-sub">Image upload batches</div>
                    </div>
                    <div className="stat-card orange">
                        <div className="stat-value">{totalImages}</div>
                        <div className="stat-label">Total Images</div>
                        <div className="stat-sub">Compressed & optimized</div>
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h2 className="section-title">User List</h2>
                            {!loading && <span className="section-count">({sortedUsers.length})</span>}
                        </div>

                        {/* Search Bar */}
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--gray-50)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
                            <input
                                type="text"
                                placeholder="Search by name, email, ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: 220 }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="empty-text">Loading real-time data from system...</div>
                        </div>
                    ) : error ? (
                        <div className="empty-state" style={{ color: "var(--danger)" }}>
                            <div className="empty-text">Error: {error}</div>
                            <button className="btn-secondary" style={{ marginTop: 16 }} onClick={fetchUsers}>Retry</button>
                        </div>
                    ) : sortedUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-text">No matching users found.</div>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort("userId")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        User ID <SortIcon columnKey="userId" />
                                    </th>
                                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Name <SortIcon columnKey="name" />
                                    </th>
                                    <th onClick={() => handleSort("email")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Email <SortIcon columnKey="email" />
                                    </th>
                                    <th onClick={() => handleSort("totalBatches")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Total Batches <SortIcon columnKey="totalBatches" />
                                    </th>
                                    <th onClick={() => handleSort("totalImages")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Total Images <SortIcon columnKey="totalImages" />
                                    </th>
                                    <th style={{ textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedUsers.map((user: AdminUser) => (
                                    <tr key={user.userId} onClick={() => handleUserClick(user)}>
                                        <td style={{ color: "var(--gray-500)", fontSize: 13, fontFamily: "monospace" }}>
                                            {user.userId}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{user.name || "N/A"}</td>
                                        <td>{user.email}</td>
                                        <td><span className="metric-main" style={{ color: "var(--primary)" }}>{user.totalBatches}</span></td>
                                        <td><span className="metric-main">{user.totalImages}</span></td>
                                        <td style={{ textAlign: "right" }}>
                                            <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleUserClick(user); }}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-user-info">
                                {selectedDetails?.avatarUrl ? (
                                    <img src={selectedDetails.avatarUrl} alt={selectedUser.name} className="modal-avatar" />
                                ) : (
                                    <div className="modal-avatar-fallback">
                                        {(selectedUser.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="modal-name">{selectedUser.name}</div>
                                    <div className="modal-email">{selectedUser.email}</div>
                                    <div className="modal-meta">
                                        <span className={`badge ${selectedDetails?.role === "ADMIN" ? "badge-blue" : "badge-gray"}`}>
                                            Role: {selectedDetails?.role || selectedUser.role || "USER"}
                                        </span>
                                        {selectedDetails?.status && (
                                            <span className={`badge ${selectedDetails.status === "ACTIVE" ? "badge-green" : "badge-red"}`}>
                                                Status: {selectedDetails.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-stats">
                                <div className="modal-stat">
                                    <div className="modal-stat-val">{selectedUser.totalBatches}</div>
                                    <div className="modal-stat-label">Total Batches</div>
                                </div>
                                <div className="modal-stat green">
                                    <div className="modal-stat-val">{selectedUser.totalImages}</div>
                                    <div className="modal-stat-label">Total Images</div>
                                </div>
                            </div>

                            <div className="modal-activity">
                                <div className="activity-card">
                                    <div className="activity-label">User ID</div>
                                    <div className="activity-value" style={{ fontFamily: "monospace", fontSize: 13 }}>{selectedUser.userId}</div>
                                </div>
                                <div className="activity-card">
                                    <div className="activity-label">Joined Date</div>
                                    <div className="activity-value">
                                        {loadingDetails
                                            ? "Loading..."
                                            : selectedDetails?.createdAt
                                                ? new Date(selectedDetails.createdAt).toLocaleString("en-US")
                                                : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

