import CreateUser from './components/CreateUser.jsx';
import Dashboard from './components/Dashboard.jsx';
import Exams from './components/Exams.jsx';
import PracticeDrills from './components/PracticeDrills.jsx';

const { HashRouter, Route, Switch, NavLink, Redirect } = ReactRouterDOM;

export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const stored = localStorage.getItem('sololingua_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <HashRouter>
      <nav>
        <NavLink exact to="/" activeClassName="active">Dashboard</NavLink>{' | '}
        <NavLink to="/exams" activeClassName="active">Exams</NavLink>{' | '}
        <NavLink to="/practice" activeClassName="active">Practice</NavLink>
      </nav>
      <Switch>
        <Route path="/setup" render={() => <CreateUser onCreated={setUser} />} />
        <Route exact path="/" render={() => user ? <Dashboard user={user} /> : <Redirect to="/setup" />} />
        <Route path="/exams" render={() => user ? <Exams user={user} /> : <Redirect to="/setup" />} />
        <Route path="/practice" render={() => user ? <PracticeDrills user={user} /> : <Redirect to="/setup" />} />
      </Switch>
    </HashRouter>
  );
}
