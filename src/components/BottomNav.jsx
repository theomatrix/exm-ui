import { NavLink } from 'react-router-dom'
import { Home, Plus, FileText, Settings } from 'lucide-react'

function BottomNav() {
    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-inner">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Home size={22} />
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/my-entries"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FileText size={22} />
                    <span>Entries</span>
                </NavLink>

                <NavLink
                    to="/add-entry"
                    className="nav-add-btn"
                >
                    <Plus size={28} />
                </NavLink>

                <NavLink
                    to="/reports"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FileText size={22} />
                    <span>Reports</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Settings size={22} />
                    <span>Settings</span>
                </NavLink>
            </div>
        </nav>
    )
}

export default BottomNav
