const _jsxFileName = "frontend/src/components/Exams.jsx";export default function Exams({ user }) {
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

  if (!user) return React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}, "Please create your profile first."    );
  if (!test) return React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Loading...");

  return (
    React.createElement('div', { className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
      , React.createElement('div', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
        , React.createElement('label', { className: "form-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, "Section"

          , React.createElement('select', {
            className: "form-select",
            value: section,
            onChange: e => setSection(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}

            , React.createElement('option', { value: "Reading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Reading")
            , React.createElement('option', { value: "Listening", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Listening")
            , React.createElement('option', { value: "Writing", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}, "Writing")
          )
        )
      )
      , React.createElement('h2', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, test.title)
      , section === 'Writing' ? (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}, test.prompt)
          , React.createElement('textarea', {
            value: essay,
            onChange: e => setEssay(e.target.value),
            rows: 10,
            cols: 60, __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
          )
        )
      ) : (
        test.questions.map(q => (
          React.createElement('div', { key: q.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, q.prompt)
            , q.audio_url && (
              React.createElement('audio', { controls: true, src: q.audio_url, __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}})
            )
            , JSON.parse(q.options_json).map(opt => (
              React.createElement('div', { className: "form-check", key: opt, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                , React.createElement('input', {
                  type: "radio",
                  className: "form-check-input",
                  name: q.id,
                  value: opt,
                  onChange: e => setAnswers({ ...answers, [q.id]: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
                )
                , React.createElement('label', { className: "form-check-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, opt)
              )
            ))
          )
        ))
      )
      , React.createElement('button', { onClick: handleSubmit, className: "btn btn-primary mt-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, "Submit")
      , score !== null && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, "Your score: "  , score))
          , result && section === 'Writing' && (
            React.createElement('pre', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}, JSON.stringify(result.feedback, null, 2))
          )
          , result && section !== 'Writing' && (
            React.createElement('ul', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
              , result.answers.map(a => (
                React.createElement('li', { key: a.question_id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Q"
                  , a.question_id, ": " , a.correct ? '✓' : '✗', " (you: "  , a.response, ")"
                )
              ))
            )
          )
        )
      )
    )
  );
}
