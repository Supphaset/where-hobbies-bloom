const _jsxFileName = "frontend/src/Layout.jsx";const { NavLink } = ReactRouterDOM;

export default function Layout({ children }) {
  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5}}
      , React.createElement('nav', { className: "navbar navbar-expand-lg navbar-dark bg-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
        , React.createElement('div', { className: "container-fluid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
          , React.createElement(NavLink, { className: "navbar-brand", to: "/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}, "SoloLingua")
          , React.createElement('div', { className: "navbar-nav", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
            , React.createElement(NavLink, { exact: true, to: "/", className: "nav-link", activeClassName: "active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}, "Dashboard")
            , React.createElement(NavLink, { to: "/exams", className: "nav-link", activeClassName: "active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}, "Exams")
            , React.createElement(NavLink, { to: "/practice", className: "nav-link", activeClassName: "active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}, "Practice")
          )
        )
      )
      , React.createElement('div', { className: "container mt-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
        , children
      )
    )
  );
}
