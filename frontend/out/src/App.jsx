import CreateUser from './components/CreateUser.jsx';
import Dashboard from './components/Dashboard.jsx';
import Exams from './components/Exams.jsx';
import PracticeDrills from './components/PracticeDrills.jsx';
import Layout from './Layout.jsx';

const { HashRouter, Route, Switch, Redirect } = ReactRouterDOM;

export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const stored = localStorage.getItem('sololingua_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return /*#__PURE__*/React.createElement(HashRouter, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "/",
    render: () => user ? /*#__PURE__*/React.createElement(Dashboard, {
      user: user
    }) : /*#__PURE__*/React.createElement(CreateUser, {
      onCreated: setUser
    })
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/setup",
    render: () => /*#__PURE__*/React.createElement(CreateUser, {
      onCreated: setUser
    })
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/exams",
    render: () => user ? /*#__PURE__*/React.createElement(Exams, {
      user: user
    }) : /*#__PURE__*/React.createElement(Redirect, {
      to: "/setup"
    })
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/practice",
    render: () => user ? /*#__PURE__*/React.createElement(PracticeDrills, {
      user: user
    }) : /*#__PURE__*/React.createElement(Redirect, {
      to: "/setup"
    })
  }))));
}
