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
    <div>
      <h2>Practice Drills</h2>
      <div>
        <h3>Vocabulary</h3>
        {vocab ? (
          <div>
            <p>{vocab.word} - {vocab.definition}</p>
            <button onClick={() => handleVocab(true)}>Know</button>
            <button onClick={() => handleVocab(false)}>Don't Know</button>
          </div>
        ) : (
          <button onClick={() => fetch(`/drills/vocab/${user.id}`).then(res => res.json()).then(setVocab)}>Start</button>
        )}
      </div>
      <div>
        <h3>Grammar</h3>
        {grammar ? (
          <div>
            <p>{grammar.prompt}</p>
            {grammar.options.map(opt => (
              <button key={opt} onClick={() => answerGrammar(opt)}>{opt}</button>
            ))}
            {grammarResult !== null && (
              <span>{grammarResult ? 'Correct!' : 'Try again'}</span>
            )}
          </div>
        ) : (
          <button onClick={() => fetch(`/drills/grammar/${user.id}`).then(res => res.json()).then(setGrammar)}>Start</button>
        )}
      </div>
      <div>
        <h3>Quick Write</h3>
        {quickPrompt ? (
          <div>
            <p>{quickPrompt}</p>
            <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={5} cols={40} />
            <button onClick={submitQuick}>Submit</button>
            {feedback && <pre>{JSON.stringify(feedback, null, 2)}</pre>}
          </div>
        ) : (
          <button onClick={fetchQuickPrompt}>New Prompt</button>
        )}
      </div>
    </div>
  );
}
