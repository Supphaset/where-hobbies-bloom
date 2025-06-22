const { NavLink } = ReactRouterDOM;

export default function Layout({ children }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">SoloLingua</NavLink>
          <div className="navbar-nav">
            <NavLink exact to="/" className="nav-link" activeClassName="active">Dashboard</NavLink>
            <NavLink to="/exams" className="nav-link" activeClassName="active">Exams</NavLink>
            <NavLink to="/practice" className="nav-link" activeClassName="active">Practice</NavLink>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        {children}
      </div>
    </div>
  );
}
