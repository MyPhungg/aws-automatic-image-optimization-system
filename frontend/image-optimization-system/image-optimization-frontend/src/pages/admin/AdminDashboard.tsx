import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AdminUser } from "../../types/Admin";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Bổ sung State cho tìm kiếm và sắp xếp
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<keyof AdminUser>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        // TODO: Thay thế bằng URL API Gateway thực tế của bạn
        const fetchUsers = async () => {
            try {
                // Giả lập call API:
                const data: AdminUser[] = [
                    { userId: "google-101", email: "alice@gmail.com", name: "Alice Nguyễn", totalBatches: 35, totalImages: 412 },
                    { userId: "google-102", email: "bob@gmail.com", name: "Bob Trần", totalBatches: 5, totalImages: 86 },
                    { userId: "google-103", email: "carol@gmail.com", name: "Carol Lê", totalBatches: 12, totalImages: 231 },
                ];
                setUsers(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Logic tìm kiếm
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Logic sắp xếp
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
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
                    <Link to="/" className="admin-logo">
                        <span className="admin-logo-main">IMGO</span>
                        <span className="admin-logo-sub">Image Optimization System</span>
                        <span className="admin-logo-badge">Admin</span>
                    </Link>
                </div>
            </header>

            <main className="admin-body">
                <div className="admin-page-header">
                    <h1>Danh sách người dùng</h1>
                    <p>Hiển thị dữ liệu trả về trực tiếp từ API hệ thống, hỗ trợ tìm kiếm và sắp xếp.</p>
                </div>

                <div className="section-card">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h2 className="section-title">Thành viên hệ thống</h2>
                            {!loading && <span className="section-count">({sortedUsers.length})</span>}
                        </div>
                        
                        {/* Thanh tìm kiếm */}
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--gray-50)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
                            <span style={{ marginRight: 8, opacity: 0.5 }}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Tìm theo tên, email, ID..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: 220 }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="empty-state" style={{color: "red"}}>Lỗi: {error}</div>
                    ) : sortedUsers.length === 0 ? (
                        <div className="empty-state">Không tìm thấy người dùng nào phù hợp.</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort("userId")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        User ID <SortIcon columnKey="userId" />
                                    </th>
                                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Họ tên <SortIcon columnKey="name" />
                                    </th>
                                    <th onClick={() => handleSort("email")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Email <SortIcon columnKey="email" />
                                    </th>
                                    <th onClick={() => handleSort("totalBatches")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Tổng số Batch <SortIcon columnKey="totalBatches" />
                                    </th>
                                    <th onClick={() => handleSort("totalImages")} style={{ cursor: "pointer", userSelect: "none" }}>
                                        Tổng số Ảnh <SortIcon columnKey="totalImages" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedUsers.map((user: AdminUser) => (
                                    <tr key={user.userId}>
                                        <td style={{ color: "var(--gray-500)", fontSize: 13 }}>
                                            {user.userId}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td><span className="metric-main" style={{ color: "var(--primary)" }}>{user.totalBatches}</span></td>
                                        <td><span className="metric-main">{user.totalImages}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
