'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = Exams;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Exams(_ref) {
  var user = _ref.user;

  var _React$useState = React.useState(null);

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var test = _React$useState2[0];
  var setTest = _React$useState2[1];

  var _React$useState3 = React.useState({});

  var _React$useState32 = _slicedToArray(_React$useState3, 2);

  var answers = _React$useState32[0];
  var setAnswers = _React$useState32[1];

  var _React$useState4 = React.useState(null);

  var _React$useState42 = _slicedToArray(_React$useState4, 2);

  var score = _React$useState42[0];
  var setScore = _React$useState42[1];

  var _React$useState5 = React.useState(null);

  var _React$useState52 = _slicedToArray(_React$useState5, 2);

  var result = _React$useState52[0];
  var setResult = _React$useState52[1];

  var _React$useState6 = React.useState('');

  var _React$useState62 = _slicedToArray(_React$useState6, 2);

  var essay = _React$useState62[0];
  var setEssay = _React$useState62[1];

  var _React$useState7 = React.useState('Reading');

  var _React$useState72 = _slicedToArray(_React$useState7, 2);

  var section = _React$useState72[0];
  var setSection = _React$useState72[1];

  var DURATIONS = { Reading: 60, Listening: 60, Writing: 60 };

  var _React$useState8 = React.useState(DURATIONS[section]);

  var _React$useState82 = _slicedToArray(_React$useState8, 2);

  var timeLeft = _React$useState82[0];
  var setTimeLeft = _React$useState82[1];

  var _React$useState9 = React.useState(false);

  var _React$useState92 = _slicedToArray(_React$useState9, 2);

  var started = _React$useState92[0];
  var setStarted = _React$useState92[1];

  React.useEffect(function () {
    if (!started) return;
    if (section === 'Writing') {
      fetch('/exams/IELTS/Writing').then(function (res) {
        return res.json();
      }).then(function (data) {
        setTest(data);
        setEssay('');
        setScore(null);
        setResult(null);
      });
    } else {
      fetch('/exams/IELTS/' + section).then(function (res) {
        return res.json();
      }).then(function (data) {
        setTest(data);
        setAnswers({});
        setScore(null);
        setResult(null);
      });
    }
  }, [section, started]);

  React.useEffect(function () {
    var timer = undefined;
    if (test && started) {
      setTimeLeft(DURATIONS[section]);
      timer = setInterval(function () {
        setTimeLeft(function (prev) {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return function () {
      return clearInterval(timer);
    };
  }, [test, section, started]);

  var handleSubmit = function handleSubmit() {
    if (section === 'Writing') {
      fetch('/exams/IELTS/Writing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, text: essay })
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        setScore(data.score);
        setResult(data);
      });
    } else {
      var payload = {
        user_id: user.id,
        answers: Object.entries(answers).map(function (_ref2) {
          var _ref22 = _slicedToArray(_ref2, 2);

          var question_id = _ref22[0];
          var response = _ref22[1];
          return { question_id: parseInt(question_id), response: response };
        })
      };
      fetch('/exams/IELTS/' + section + '/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        setScore(data.score);
        setResult(data);
      });
    }
  };

  if (!user) return React.createElement(
    'p',
    null,
    'Please create your profile first.'
  );
  if (!started) {
    return React.createElement(
      'div',
      { className: 'mt-4' },
      React.createElement(
        'div',
        { className: 'mb-3' },
        React.createElement(
          'label',
          { className: 'form-label' },
          'Section',
          React.createElement(
            'select',
            {
              className: 'form-select',
              value: section,
              onChange: function (e) {
                setSection(e.target.value);
                setStarted(false);
                setTest(null);
              }
            },
            React.createElement(
              'option',
              { value: 'Reading' },
              'Reading'
            ),
            React.createElement(
              'option',
              { value: 'Listening' },
              'Listening'
            ),
            React.createElement(
              'option',
              { value: 'Writing' },
              'Writing'
            )
          )
        )
      ),
      React.createElement(
        'button',
        { onClick: function () {
            return setStarted(true);
          }, className: 'btn btn-primary' },
        'Start'
      )
    );
  }
  if (!test) return React.createElement(
    'p',
    null,
    'Loading...'
  );

  return React.createElement(
    'div',
    { className: 'mt-4' },
    React.createElement(
      'div',
      { className: 'mb-3' },
      React.createElement(
        'label',
        { className: 'form-label' },
        'Section',
        React.createElement(
          'select',
          {
            className: 'form-select',
            value: section,
            onChange: function (e) {
              setSection(e.target.value);
              setStarted(false);
              setTest(null);
            }
          },
          React.createElement(
            'option',
            { value: 'Reading' },
            'Reading'
          ),
          React.createElement(
            'option',
            { value: 'Listening' },
            'Listening'
          ),
          React.createElement(
            'option',
            { value: 'Writing' },
            'Writing'
          )
        )
      )
    ),
    React.createElement(
      'h2',
      { className: 'mb-3' },
      test.title
    ),
    started && React.createElement(
      'p',
      null,
      'Time left: ',
      timeLeft,
      's'
    ),
    section === 'Writing' ? React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        test.prompt
      ),
      React.createElement('textarea', {
        value: essay,
        onChange: function (e) {
          return setEssay(e.target.value);
        },
        rows: 10,
        cols: 60
      })
    ) : test.questions.map(function (q) {
      return React.createElement(
        'div',
        { key: q.id },
        React.createElement(
          'p',
          null,
          q.prompt
        ),
        q.audio_url && React.createElement('audio', { controls: true, src: q.audio_url }),
        JSON.parse(q.options_json).map(function (opt) {
          return React.createElement(
            'div',
            { className: 'form-check', key: opt },
            React.createElement('input', {
              type: 'radio',
              className: 'form-check-input',
              name: q.id,
              value: opt,
              onChange: function (e) {
                return setAnswers(_extends({}, answers, _defineProperty({}, q.id, e.target.value)));
              }
            }),
            React.createElement(
              'label',
              { className: 'form-check-label' },
              opt
            )
          );
        })
      );
    }),
    React.createElement(
      'button',
      { onClick: handleSubmit, className: 'btn btn-primary mt-3', disabled: !started || timeLeft === 0 },
      'Submit'
    ),
    score !== null && React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        React.createElement(
          'strong',
          null,
          'Your score: ',
          score
        )
      ),
      result && section === 'Writing' && React.createElement(
        'pre',
        null,
        JSON.stringify(result.feedback, null, 2)
      ),
      result && section !== 'Writing' && React.createElement(
        'ul',
        null,
        result.answers.map(function (a) {
          return React.createElement(
            'li',
            { key: a.question_id },
            'Q',
            a.question_id,
            ': ',
            a.correct ? '✓' : '✗',
            ' (you: ',
            a.response,
            ')'
          );
        })
      )
    )
  );
}

module.exports = exports['default'];
