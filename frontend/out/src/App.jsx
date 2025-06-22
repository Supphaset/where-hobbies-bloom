const _jsxFileName = "frontend/src/App.jsx";import CreateUser from './components/CreateUser.jsx';
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

  return (
    React.createElement(HashRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
      , React.createElement(Layout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
        , React.createElement(Switch, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
          , React.createElement(Route, { path: "/setup", render: () => React.createElement(CreateUser, { onCreated: setUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}} )
          , React.createElement(Route, { exact: true, path: "/", render: () => user ? React.createElement(Dashboard, { user: user, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} ) : React.createElement(CreateUser, { onCreated: setUser, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
          , React.createElement(Route, { path: "/exams", render: () => user ? React.createElement(Exams, { user: user, __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} ) : React.createElement(Redirect, { to: "/setup", __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} )
          , React.createElement(Route, { path: "/practice", render: () => user ? React.createElement(PracticeDrills, { user: user, __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} ) : React.createElement(Redirect, { to: "/setup", __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
        )
      )
    )
  );
}
