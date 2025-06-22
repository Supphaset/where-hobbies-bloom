export default function Exams({
  user
}) {
  const [test, setTest] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [score, setScore] = React.useState(null);
  const [section, setSection] = React.useState('Reading');
  React.useEffect(() => {
    fetch(`/exams/IELTS/${section}`).then(res => res.json()).then(data => {
      setTest(data);
      setAnswers({});
      setScore(null);
    });
  }, [section]);
  const handleSubmit = () => {
    const payload = {
      user_id: user.id,
      answers: Object.entries(answers).map(([question_id, response]) => ({
        question_id: parseInt(question_id),
        response
      }))
    };
    fetch(`/exams/IELTS/${section}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => setScore(data.score));
  };
  if (!user) return /*#__PURE__*/React.createElement("p", null, "Please create your profile first.");
  if (!test) return /*#__PURE__*/React.createElement("p", null, "Loading...");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Section:", /*#__PURE__*/React.createElement("select", {
    value: section,
    onChange: e => setSection(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "Reading"
  }, "Reading"), /*#__PURE__*/React.createElement("option", {
    value: "Listening"
  }, "Listening")))), /*#__PURE__*/React.createElement("h2", null, test.title), test.questions.map(q => /*#__PURE__*/React.createElement("div", {
    key: q.id
  }, /*#__PURE__*/React.createElement("p", null, q.prompt), q.audio_url && /*#__PURE__*/React.createElement("audio", {
    controls: true,
    src: q.audio_url
  }), JSON.parse(q.options_json).map(opt => /*#__PURE__*/React.createElement("label", {
    key: opt
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: q.id,
    value: opt,
    onChange: e => setAnswers({
      ...answers,
      [q.id]: e.target.value
    })
  }), opt)))), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit
  }, "Submit"), score !== null && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Your score: ", score)));
}
