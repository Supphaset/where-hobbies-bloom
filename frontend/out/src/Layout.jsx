const { NavLink } = ReactRouterDOM;

export default function Layout({ children }) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'nav',
      { className: 'navbar navbar-expand-lg navbar-dark bg-primary' },
      React.createElement(
        'div',
        { className: 'container-fluid' },
        React.createElement(NavLink, { className: 'navbar-brand', to: '/' }, 'SoloLingua'),
        React.createElement(
          'div',
          { className: 'navbar-nav' },
          React.createElement(NavLink, { exact: true, to: '/', className: 'nav-link', activeClassName: 'active' }, 'Dashboard'),
          React.createElement(NavLink, { to: '/exams', className: 'nav-link', activeClassName: 'active' }, 'Exams'),
          React.createElement(NavLink, { to: '/practice', className: 'nav-link', activeClassName: 'active' }, 'Practice')
        )
      )
    ),
    React.createElement('div', { className: 'container mt-4' }, children)
  );
}
