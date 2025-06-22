const _jsxFileName = "frontend/src/components/PracticeDrills.jsx";export default function PracticeDrills({ user }) {
  const [vocab, setVocab] = React.useState(null);
  const [grammar, setGrammar] = React.useState(null);
  const [grammarResult, setGrammarResult] = React.useState(null);
  const [quickPrompt, setQuickPrompt] = React.useState(null);
  const [essay, setEssay] = React.useState('');
  const [feedback, setFeedback] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    fetch(`/drills/vocab/${user.id}`)
      .then(res => res.json())
      .then(setVocab);
    fetch(`/drills/grammar/${user.id}`)
      .then(res => res.json())
      .then(setGrammar);
  }, [user]);

  const handleVocab = correct => {
    fetch(`/drills/vocab/${user.id}/${vocab.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct })
    }).then(() => {
      fetch(`/drills/vocab/${user.id}`)
        .then(res => res.json())
        .then(setVocab);
    });
  };

  const answerGrammar = opt => {
    fetch(`/drills/grammar/${user.id}/${grammar.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: opt })
    })
      .then(res => res.json())
      .then(data => {
        setGrammarResult(data.correct);
        fetch(`/drills/grammar/${user.id}`)
          .then(res => res.json())
          .then(setGrammar);
      });
  };

  const fetchQuickPrompt = () => {
    fetch('/drills/quick-write')
      .then(res => res.json())
      .then(data => {
        setQuickPrompt(data.prompt);
        setEssay('');
        setFeedback(null);
      });
  };

  const submitQuick = () => {
    fetch('/drills/quick-write/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, text: essay })
    })
      .then(res => res.json())
      .then(data => setFeedback(data.feedback));
  };

  return (
    React.createElement('div', { className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
      , React.createElement('h2', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Practice Drills" )
      , React.createElement('div', { className: "mb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
        , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Vocabulary")
        , vocab ? (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}, vocab.word, " - "  , vocab.definition)
            , React.createElement('button', { onClick: () => handleVocab(true), className: "btn btn-success me-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Know")
            , React.createElement('button', { onClick: () => handleVocab(false), className: "btn btn-secondary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Don't Know" )
          )
        ) : (
          React.createElement('button', { onClick: () => fetch(`/drills/vocab/${user.id}`).then(res => res.json()).then(setVocab), className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "Start")
        )
      )
      , React.createElement('div', { className: "mb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
        , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, "Grammar")
        , grammar ? (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}, grammar.prompt)
            , grammar.options.map(opt => (
              React.createElement('button', { key: opt, onClick: () => answerGrammar(opt), className: "btn btn-outline-primary me-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, opt)
            ))
            , grammarResult !== null && (
              React.createElement('span', { className: "ms-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, grammarResult ? 'Correct!' : 'Try again')
            )
          )
        ) : (
          React.createElement('button', { onClick: () => fetch(`/drills/grammar/${user.id}`).then(res => res.json()).then(setGrammar), className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, "Start")
        )
      )
      , React.createElement('div', { className: "mb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
        , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Quick Write" )
        , quickPrompt ? (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, quickPrompt)
            , React.createElement('textarea', { value: essay, onChange: e => setEssay(e.target.value), rows: 5, className: "form-control mb-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}} )
            , React.createElement('button', { onClick: submitQuick, className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Submit")
            , feedback && React.createElement('pre', { className: "mt-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, JSON.stringify(feedback, null, 2))
          )
        ) : (
          React.createElement('button', { onClick: fetchQuickPrompt, className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "New Prompt" )
        )
      )
    )
  );
}
