export default function PracticeDrills({ user }) {
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
    <div className="mt-4">
      <h2 className="mb-3">Practice Drills</h2>
      <div className="mb-4">
        <h3>Vocabulary</h3>
        {vocab ? (
          <div>
            <p>{vocab.word} - {vocab.definition}</p>
            <button onClick={() => handleVocab(true)} className="btn btn-success me-2">Know</button>
            <button onClick={() => handleVocab(false)} className="btn btn-secondary">Don't Know</button>
          </div>
        ) : (
          <button onClick={() => fetch(`/drills/vocab/${user.id}`).then(res => res.json()).then(setVocab)} className="btn btn-primary">Start</button>
        )}
      </div>
      <div className="mb-4">
        <h3>Grammar</h3>
        {grammar ? (
          <div>
            <p>{grammar.prompt}</p>
            {grammar.options.map(opt => (
              <button key={opt} onClick={() => answerGrammar(opt)} className="btn btn-outline-primary me-2 mb-2">{opt}</button>
            ))}
            {grammarResult !== null && (
              <span className="ms-2">{grammarResult ? 'Correct!' : 'Try again'}</span>
            )}
          </div>
        ) : (
          <button onClick={() => fetch(`/drills/grammar/${user.id}`).then(res => res.json()).then(setGrammar)} className="btn btn-primary">Start</button>
        )}
      </div>
      <div className="mb-4">
        <h3>Quick Write</h3>
        {quickPrompt ? (
          <div>
            <p>{quickPrompt}</p>
            <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={5} className="form-control mb-2" />
            <button onClick={submitQuick} className="btn btn-primary">Submit</button>
            {feedback && <pre className="mt-2">{JSON.stringify(feedback, null, 2)}</pre>}
          </div>
        ) : (
          <button onClick={fetchQuickPrompt} className="btn btn-primary">New Prompt</button>
        )}
      </div>
    </div>
  );
}
