const {
  NavLink
} = ReactRouterDOM;
export default function Layout({
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
    className: "navbar navbar-expand-lg navbar-dark bg-primary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement(NavLink, {
    className: "navbar-brand",
    to: "/"
  }, "SoloLingua"), /*#__PURE__*/React.createElement("div", {
    className: "navbar-nav"
  }, /*#__PURE__*/React.createElement(NavLink, {
    exact: true,
    to: "/",
    className: "nav-link",
    activeClassName: "active"
  }, "Dashboard"), /*#__PURE__*/React.createElement(NavLink, {
    to: "/exams",
    className: "nav-link",
    activeClassName: "active"
  }, "Exams"), /*#__PURE__*/React.createElement(NavLink, {
    to: "/practice",
    className: "nav-link",
    activeClassName: "active"
  }, "Practice"), /*#__PURE__*/React.createElement(NavLink, {
    to: "/admin",
    className: "nav-link",
    activeClassName: "active"
  }, "Admin")))), /*#__PURE__*/React.createElement("div", {
    className: "container mt-4"
  }, children));
}

