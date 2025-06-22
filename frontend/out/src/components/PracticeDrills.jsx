export default function PracticeDrills({
  user
}) {
  const [vocab, setVocab] = React.useState(null);
  const [grammar, setGrammar] = React.useState(null);
  const [grammarResult, setGrammarResult] = React.useState(null);
  const [quickPrompt, setQuickPrompt] = React.useState(null);
  const [essay, setEssay] = React.useState('');
  const [feedback, setFeedback] = React.useState(null);
  React.useEffect(() => {
    if (!user) return;
    fetch(`/drills/vocab/${user.id}`).then(res => res.json()).then(setVocab);
    fetch(`/drills/grammar/${user.id}`).then(res => res.json()).then(setGrammar);
  }, [user]);

  const handleVocab = correct => {
    fetch(`/drills/vocab/${user.id}/${vocab.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correct
      })
    }).then(() => {
      fetch(`/drills/vocab/${user.id}`).then(res => res.json()).then(setVocab);
    });
  };

  const fetchQuickPrompt = () => {
    fetch('/drills/quick-write').then(res => res.json()).then(data => {
      setQuickPrompt(data.prompt);
      setEssay('');
      setFeedback(null);
    });
  };

  const submitQuick = () => {
    fetch('/drills/quick-write/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        text: essay
      })
    }).then(res => res.json()).then(data => setFeedback(data.feedback));
  };

  const answerGrammar = opt => {
    fetch(`/drills/grammar/${user.id}/${grammar.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: opt
      })
    }).then(res => res.json()).then(data => {
      setGrammarResult(data.correct);
      fetch(`/drills/grammar/${user.id}`).then(res => res.json()).then(setGrammar);
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-3"
  }, "Practice Drills"), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h3", null, "Vocabulary"), vocab ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, vocab.word, " - ", vocab.definition), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleVocab(true),
    className: "btn btn-success me-2"
  }, "Know"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleVocab(false),
    className: "btn btn-secondary"
  }, "Don't Know")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => fetch(`/drills/vocab/${user.id}`).then(res => res.json()).then(setVocab),
    className: "btn btn-primary"
  }, "Start")), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h3", null, "Grammar"), grammar ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, grammar.prompt), grammar.options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    onClick: () => answerGrammar(opt),
    className: "btn btn-outline-primary me-2 mb-2"
  }, opt)), grammarResult !== null && /*#__PURE__*/React.createElement("span", {
    className: "ms-2"
  }, grammarResult ? 'Correct!' : 'Try again')) : /*#__PURE__*/React.createElement("button", {
    onClick: () => fetch(`/drills/grammar/${user.id}`).then(res => res.json()).then(setGrammar),
    className: "btn btn-primary"
  }, "Start")), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h3", null, "Quick Write"), quickPrompt ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, quickPrompt), /*#__PURE__*/React.createElement("textarea", {
    value: essay,
    onChange: e => setEssay(e.target.value),
    rows: 5,
    className: "form-control mb-2"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: submitQuick,
    className: "btn btn-primary"
  }, "Submit"), feedback && /*#__PURE__*/React.createElement("pre", {
    className: "mt-2"
  }, JSON.stringify(feedback, null, 2))) : /*#__PURE__*/React.createElement("button", {
    onClick: fetchQuickPrompt,
    className: "btn btn-primary"
  }, "New Prompt")));
}
