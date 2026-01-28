function CategoryPill({ label, active = false, onClick }) {
    return (
        <button
            className={`category-pill ${active ? 'active' : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export default CategoryPill
