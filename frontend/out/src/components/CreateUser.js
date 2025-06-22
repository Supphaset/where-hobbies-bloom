'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = CreateUser;

function CreateUser(_ref) {
  var onCreated = _ref.onCreated;

  var _React$useState = React.useState('');

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var name = _React$useState2[0];
  var setName = _React$useState2[1];

  var _React$useState3 = React.useState(6);

  var _React$useState32 = _slicedToArray(_React$useState3, 2);

  var ielts = _React$useState32[0];
  var setIelts = _React$useState32[1];

  var _React$useState4 = React.useState(180);

  var _React$useState42 = _slicedToArray(_React$useState4, 2);

  var hsk = _React$useState42[0];
  var setHsk = _React$useState42[1];

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    fetch('/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, target_ielts: parseInt(ielts), target_hsk: parseInt(hsk) })
    }).then(function (res) {
      return res.json();
    }).then(function (user) {
      localStorage.setItem('sololingua_user', JSON.stringify(user));
      onCreated(user);
    });
  };

  return React.createElement(
    'form',
    { onSubmit: handleSubmit, className: 'mt-4' },
    React.createElement(
      'h2',
      { className: 'mb-3' },
      'Welcome to SoloLingua Coach'
    ),
    React.createElement(
      'div',
      { className: 'mb-3' },
      React.createElement(
        'label',
        { className: 'form-label' },
        'Name',
        React.createElement('input', {
          className: 'form-control',
          value: name,
          onChange: function (e) {
            return setName(e.target.value);
          },
          required: true
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-3' },
      React.createElement(
        'label',
        { className: 'form-label' },
        'Target IELTS',
        React.createElement('input', {
          type: 'number',
          className: 'form-control',
          value: ielts,
          onChange: function (e) {
            return setIelts(e.target.value);
          },
          required: true
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-3' },
      React.createElement(
        'label',
        { className: 'form-label' },
        'Target HSK',
        React.createElement('input', {
          type: 'number',
          className: 'form-control',
          value: hsk,
          onChange: function (e) {
            return setHsk(e.target.value);
          },
          required: true
        })
      )
    ),
    React.createElement(
      'button',
      { type: 'submit', className: 'btn btn-primary' },
      'Create Profile'
    )
  );
}

module.exports = exports['default'];
