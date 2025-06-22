import CreateUser from './components/CreateUser.jsx';
import Dashboard from './components/Dashboard.jsx';
import Exams from './components/Exams.jsx';
import PracticeDrills from './components/PracticeDrills.jsx';

const { HashRouter, Route, Switch, Link, Redirect } = ReactRouterDOM;

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
        <Link to="/">Dashboard</Link>{' | '}
        <Link to="/exams">Exams</Link>{' | '}
        <Link to="/practice">Practice</Link>
      </nav>
      <Switch>
        <Route path="/setup" render={() => <CreateUser onCreated={setUser} />} />
        <Route exact path="/" render={() => user ? <Dashboard user={user} /> : <Redirect to="/setup" />} />
        <Route path="/exams" render={() => user ? <Exams user={user} /> : <Redirect to="/setup" />} />
        <Route path="/practice" render={() => <PracticeDrills />} />
      </Switch>
    </HashRouter>
  );
}
