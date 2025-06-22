'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = Admin;

function Admin() {
  var _React$useState = React.useState(null);

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var file = _React$useState2[0];
  var setFile = _React$useState2[1];

  var _React$useState3 = React.useState('');

  var _React$useState32 = _slicedToArray(_React$useState3, 2);

  var status = _React$useState32[0];
  var setStatus = _React$useState32[1];

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    var form = new FormData();
    form.append('file', file);
    fetch('/admin/import', {
      method: 'POST',
      body: form
    }).then(function (res) {
      return res.ok ? res.json() : Promise.reject();
    }).then(function () {
      return setStatus('Import successful');
    })['catch'](function () {
      return setStatus('Import failed');
    });
  };

  return React.createElement(
    'div',
    { className: 'mt-4' },
    React.createElement(
      'h2',
      { className: 'mb-3' },
      'Admin'
    ),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      React.createElement(
        'div',
        { className: 'mb-3' },
        React.createElement('input', { type: 'file', accept: 'application/json', onChange: function (e) {
            return setFile(e.target.files[0]);
          }, className: 'form-control' })
      ),
      React.createElement(
        'button',
        { type: 'submit', className: 'btn btn-primary' },
        'Import Content'
      )
    ),
    status && React.createElement(
      'p',
      { className: 'mt-2' },
      status
    )
  );
}

module.exports = exports['default'];
