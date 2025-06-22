'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = App;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsCreateUserJsx = require('./components/CreateUser.jsx');

var _componentsCreateUserJsx2 = _interopRequireDefault(_componentsCreateUserJsx);

var _componentsDashboardJsx = require('./components/Dashboard.jsx');

var _componentsDashboardJsx2 = _interopRequireDefault(_componentsDashboardJsx);

var _componentsExamsJsx = require('./components/Exams.jsx');

var _componentsExamsJsx2 = _interopRequireDefault(_componentsExamsJsx);

var _componentsPracticeDrillsJsx = require('./components/PracticeDrills.jsx');

var _componentsPracticeDrillsJsx2 = _interopRequireDefault(_componentsPracticeDrillsJsx);

var _componentsAdminJsx = require('./components/Admin.jsx');

var _componentsAdminJsx2 = _interopRequireDefault(_componentsAdminJsx);

var _LayoutJsx = require('./Layout.jsx');

var _LayoutJsx2 = _interopRequireDefault(_LayoutJsx);

var _ReactRouterDOM = ReactRouterDOM;
var HashRouter = _ReactRouterDOM.HashRouter;
var Route = _ReactRouterDOM.Route;
var Switch = _ReactRouterDOM.Switch;
var Redirect = _ReactRouterDOM.Redirect;

function App() {
  var _React$useState = React.useState(null);

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var user = _React$useState2[0];
  var setUser = _React$useState2[1];

  React.useEffect(function () {
    var stored = localStorage.getItem('sololingua_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return React.createElement(
    HashRouter,
    null,
    React.createElement(
      _LayoutJsx2['default'],
      null,
      React.createElement(
        Switch,
        null,
        React.createElement(Route, { path: '/setup', render: function () {
            return React.createElement(_componentsCreateUserJsx2['default'], { onCreated: setUser });
          } }),
        React.createElement(Route, { exact: true, path: '/', render: function () {
            return user ? React.createElement(_componentsDashboardJsx2['default'], { user: user }) : React.createElement(_componentsCreateUserJsx2['default'], { onCreated: setUser });
          } }),
        React.createElement(Route, { path: '/exams', render: function () {
            return user ? React.createElement(_componentsExamsJsx2['default'], { user: user }) : React.createElement(Redirect, { to: '/setup' });
          } }),
        React.createElement(Route, { path: '/practice', render: function () {
            return user ? React.createElement(_componentsPracticeDrillsJsx2['default'], { user: user }) : React.createElement(Redirect, { to: '/setup' });
          } }),
        React.createElement(Route, { path: '/admin', render: function () {
            return React.createElement(_componentsAdminJsx2['default'], null);
          } })
      )
    )
  );
}

module.exports = exports['default'];
