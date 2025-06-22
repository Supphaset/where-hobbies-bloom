"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Layout;
var _ReactRouterDOM = ReactRouterDOM;
var NavLink = _ReactRouterDOM.NavLink;

function Layout(_ref) {
  var children = _ref.children;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "nav",
      { className: "navbar navbar-expand-lg navbar-dark bg-primary" },
      React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(
          NavLink,
          { className: "navbar-brand", to: "/" },
          "SoloLingua"
        ),
        React.createElement(
          "div",
          { className: "navbar-nav" },
          React.createElement(
            NavLink,
            { exact: true, to: "/", className: "nav-link", activeClassName: "active" },
            "Dashboard"
          ),
          React.createElement(
            NavLink,
            { to: "/exams", className: "nav-link", activeClassName: "active" },
            "Exams"
          ),
          React.createElement(
            NavLink,
            { to: "/practice", className: "nav-link", activeClassName: "active" },
            "Practice"
          ),
          React.createElement(
            NavLink,
            { to: "/admin", className: "nav-link", activeClassName: "active" },
            "Admin"
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "container mt-4" },
      children
    )
  );
}

module.exports = exports["default"];
