'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = PracticeDrills;

function PracticeDrills(_ref) {
  var user = _ref.user;

  var _React$useState = React.useState(null);

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var vocab = _React$useState2[0];
  var setVocab = _React$useState2[1];

  var _React$useState3 = React.useState(null);

  var _React$useState32 = _slicedToArray(_React$useState3, 2);

  var grammar = _React$useState32[0];
  var setGrammar = _React$useState32[1];

  var _React$useState4 = React.useState(null);

  var _React$useState42 = _slicedToArray(_React$useState4, 2);

  var grammarResult = _React$useState42[0];
  var setGrammarResult = _React$useState42[1];

  var _React$useState5 = React.useState(null);

  var _React$useState52 = _slicedToArray(_React$useState5, 2);

  var quickPrompt = _React$useState52[0];
  var setQuickPrompt = _React$useState52[1];

  var _React$useState6 = React.useState('');

  var _React$useState62 = _slicedToArray(_React$useState6, 2);

  var essay = _React$useState62[0];
  var setEssay = _React$useState62[1];

  var _React$useState7 = React.useState(null);

  var _React$useState72 = _slicedToArray(_React$useState7, 2);

  var feedback = _React$useState72[0];
  var setFeedback = _React$useState72[1];

  React.useEffect(function () {
    if (!user) return;
    fetch('/drills/vocab/' + user.id).then(function (res) {
      return res.json();
    }).then(setVocab);
    fetch('/drills/grammar/' + user.id).then(function (res) {
      return res.json();
    }).then(setGrammar);
  }, [user]);

  var handleVocab = function handleVocab(correct) {
    fetch('/drills/vocab/' + user.id + '/' + vocab.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct: correct })
    }).then(function () {
      fetch('/drills/vocab/' + user.id).then(function (res) {
        return res.json();
      }).then(setVocab);
    });
  };

  var answerGrammar = function answerGrammar(opt) {
    fetch('/drills/grammar/' + user.id + '/' + grammar.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: opt })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      setGrammarResult(data.correct);
      fetch('/drills/grammar/' + user.id).then(function (res) {
        return res.json();
      }).then(setGrammar);
    });
  };

  var fetchQuickPrompt = function fetchQuickPrompt() {
    fetch('/drills/quick-write').then(function (res) {
      return res.json();
    }).then(function (data) {
      setQuickPrompt(data.prompt);
      setEssay('');
      setFeedback(null);
    });
  };

  var submitQuick = function submitQuick() {
    fetch('/drills/quick-write/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, text: essay })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      return setFeedback(data.feedback);
    });
  };

  return React.createElement(
    'div',
    { className: 'mt-4' },
    React.createElement(
      'h2',
      { className: 'mb-3' },
      'Practice Drills'
    ),
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement(
        'h3',
        null,
        'Vocabulary'
      ),
      vocab ? React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          vocab.word,
          ' - ',
          vocab.definition
        ),
        React.createElement(
          'button',
          { onClick: function () {
              return handleVocab(true);
            }, className: 'btn btn-success me-2' },
          'Know'
        ),
        React.createElement(
          'button',
          { onClick: function () {
              return handleVocab(false);
            }, className: 'btn btn-secondary' },
          'Don\'t Know'
        )
      ) : React.createElement(
        'button',
        { onClick: function () {
            return fetch('/drills/vocab/' + user.id).then(function (res) {
              return res.json();
            }).then(setVocab);
          }, className: 'btn btn-primary' },
        'Start'
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement(
        'h3',
        null,
        'Grammar'
      ),
      grammar ? React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          grammar.prompt
        ),
        grammar.options.map(function (opt) {
          return React.createElement(
            'button',
            { key: opt, onClick: function () {
                return answerGrammar(opt);
              }, className: 'btn btn-outline-primary me-2 mb-2' },
            opt
          );
        }),
        grammarResult !== null && React.createElement(
          'span',
          { className: 'ms-2' },
          grammarResult ? 'Correct!' : 'Try again'
        )
      ) : React.createElement(
        'button',
        { onClick: function () {
            return fetch('/drills/grammar/' + user.id).then(function (res) {
              return res.json();
            }).then(setGrammar);
          }, className: 'btn btn-primary' },
        'Start'
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement(
        'h3',
        null,
        'Quick Write'
      ),
      quickPrompt ? React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          quickPrompt
        ),
        React.createElement('textarea', { value: essay, onChange: function (e) {
            return setEssay(e.target.value);
          }, rows: 5, className: 'form-control mb-2' }),
        React.createElement(
          'button',
          { onClick: submitQuick, className: 'btn btn-primary' },
          'Submit'
        ),
        feedback && React.createElement(
          'pre',
          { className: 'mt-2' },
          JSON.stringify(feedback, null, 2)
        )
      ) : React.createElement(
        'button',
        { onClick: fetchQuickPrompt, className: 'btn btn-primary' },
        'New Prompt'
      )
    )
  );
}

module.exports = exports['default'];
