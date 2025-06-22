const { NavLink } = ReactRouterDOM;

export default function Layout({ children }) {
  return (
    <div>
      <header className="header">
        <h1>SoloLingua Coach</h1>
      </header>
      <nav className="nav">
        <NavLink exact to="/" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/exams" activeClassName="active">Exams</NavLink>
        <NavLink to="/practice" activeClassName="active">Practice</NavLink>
      </nav>
      <div className="container">
        {children}
      </div>
    </div>
  );
}
