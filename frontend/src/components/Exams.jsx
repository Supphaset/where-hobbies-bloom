export default function Exams({ user }) {
  const [test, setTest] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [score, setScore] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [essay, setEssay] = React.useState('');
  const [section, setSection] = React.useState('Reading');

  React.useEffect(() => {
    if (section === 'Writing') {
      fetch('/exams/IELTS/Writing')
        .then(res => res.json())
        .then(data => {
          setTest(data);
          setEssay('');
          setScore(null);
          setResult(null);
        });
    } else {
      fetch(`/exams/IELTS/${section}`)
        .then(res => res.json())
        .then(data => {
          setTest(data);
          setAnswers({});
          setScore(null);
          setResult(null);
        });
    }
  }, [section]);

  const handleSubmit = () => {
    if (section === 'Writing') {
      fetch('/exams/IELTS/Writing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, text: essay })
      })
        .then(res => res.json())
        .then(data => {
          setScore(data.score);
          setResult(data);
        });
    } else {
      const payload = {
        user_id: user.id,
        answers: Object.entries(answers).map(([question_id, response]) => ({ question_id: parseInt(question_id), response }))
      };
      fetch(`/exams/IELTS/${section}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          setScore(data.score);
          setResult(data);
        });
    }
  };

  if (!user) return <p>Please create your profile first.</p>;
  if (!test) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <label>
          Section:
          <select value={section} onChange={e => setSection(e.target.value)}>
            <option value="Reading">Reading</option>
            <option value="Listening">Listening</option>
            <option value="Writing">Writing</option>
          </select>
        </label>
      </div>
      <h2>{test.title}</h2>
      {section === 'Writing' ? (
        <div>
          <p>{test.prompt}</p>
          <textarea
            value={essay}
            onChange={e => setEssay(e.target.value)}
            rows={10}
            cols={60}
          />
        </div>
      ) : (
        test.questions.map(q => (
          <div key={q.id}>
            <p>{q.prompt}</p>
            {q.audio_url && (
              <audio controls src={q.audio_url}></audio>
            )}
            {JSON.parse(q.options_json).map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                />
                {opt}
              </label>
            ))}
          </div>
        ))
      )}
      <button onClick={handleSubmit}>Submit</button>
      {score !== null && (
        <div>
          <p><strong>Your score: {score}</strong></p>
          {result && section === 'Writing' && (
            <pre>{JSON.stringify(result.feedback, null, 2)}</pre>
          )}
          {result && section !== 'Writing' && (
            <ul>
              {result.answers.map(a => (
                <li key={a.question_id}>
                  Q{a.question_id}: {a.correct ? '✓' : '✗'} (you: {a.response})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
