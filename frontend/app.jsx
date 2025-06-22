const { HashRouter, Route, Switch, Link } = ReactRouterDOM;

function Dashboard() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch('/dashboard/1')
      .then(res => res.json())
      .then(setData);
  }, []);
  return (
    <div>
      <h2>Dashboard</h2>
      {data ? (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function Exams() {
  const [test, setTest] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [score, setScore] = React.useState(null);

  React.useEffect(() => {
    fetch('/exams/IELTS')
      .then(res => res.json())
      .then(setTest);
  }, []);

  const handleSubmit = () => {
    const payload = {
      user_id: 1,
      answers: Object.entries(answers).map(([question_id, response]) => ({ question_id: parseInt(question_id), response }))
    };
    fetch('/exams/IELTS/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => setScore(data.score));
  };

  if (!test) return <p>Loading...</p>;

  return (
    <div>
      <h2>{test.title}</h2>
      {test.questions.map(q => (
        <div key={q.id}>
          <p>{q.prompt}</p>
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
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {score !== null && <p>Score: {score}</p>}
    </div>
  );
}

function PracticeDrills() {
  return (
    <div>
      <h2>Practice Drills</h2>
      <p>Drill activities will be available here.</p>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <nav>
        <Link to="/">Dashboard</Link>{' | '}
        <Link to="/exams">Exams</Link>{' | '}
        <Link to="/practice">Practice</Link>
      </nav>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/exams" component={Exams} />
        <Route path="/practice" component={PracticeDrills} />
      </Switch>
    </HashRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
