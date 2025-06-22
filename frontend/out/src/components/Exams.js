export default function Exams({
  user
}) {
  const [test, setTest] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [score, setScore] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [essay, setEssay] = React.useState('');
  const [section, setSection] = React.useState('Reading');
  const DURATIONS = {
    Reading: 60,
    Listening: 60,
    Writing: 60
  };
  const [timeLeft, setTimeLeft] = React.useState(DURATIONS[section]);
  const [started, setStarted] = React.useState(false);
  React.useEffect(() => {
    if (!started) return;
    if (section === 'Writing') {
      fetch('/exams/IELTS/Writing').then(res => res.json()).then(data => {
        setTest(data);
        setEssay('');
        setScore(null);
        setResult(null);
      });
    } else {
      fetch(`/exams/IELTS/${section}`).then(res => res.json()).then(data => {
        setTest(data);
        setAnswers({});
        setScore(null);
        setResult(null);
      });
    }
  }, [section, started]);
  React.useEffect(() => {
    let timer;
    if (test && started) {
      setTimeLeft(DURATIONS[section]);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [test, section, started]);
  const handleSubmit = () => {
    if (section === 'Writing') {
      fetch('/exams/IELTS/Writing/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          text: essay
        })
      }).then(res => res.json()).then(data => {
        setScore(data.score);
        setResult(data);
      });
    } else {
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
      }).then(res => res.json()).then(data => {
        setScore(data.score);
        setResult(data);
      });
    }
  };
  if (!user) return /*#__PURE__*/React.createElement("p", null, "Please create your profile first.");
  if (!started) {
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Section", /*#__PURE__*/React.createElement("select", {
      className: "form-select",
      value: section,
      onChange: e => {
        setSection(e.target.value);
        setStarted(false);
        setTest(null);
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "Reading"
    }, "Reading"), /*#__PURE__*/React.createElement("option", {
      value: "Listening"
    }, "Listening"), /*#__PURE__*/React.createElement("option", {
      value: "Writing"
    }, "Writing")))), /*#__PURE__*/React.createElement("button", {
      onClick: () => setStarted(true),
      className: "btn btn-primary"
    }, "Start"));
  }
  if (!test) return /*#__PURE__*/React.createElement("p", null, "Loading...");
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Section", /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: section,
    onChange: e => {
      setSection(e.target.value);
      setStarted(false);
      setTest(null);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "Reading"
  }, "Reading"), /*#__PURE__*/React.createElement("option", {
    value: "Listening"
  }, "Listening"), /*#__PURE__*/React.createElement("option", {
    value: "Writing"
  }, "Writing")))), /*#__PURE__*/React.createElement("h2", {
    className: "mb-3"
  }, test.title), started && /*#__PURE__*/React.createElement("p", null, "Time left: ", timeLeft, "s"), section === 'Writing' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, test.prompt), /*#__PURE__*/React.createElement("textarea", {
    value: essay,
    onChange: e => setEssay(e.target.value),
    rows: 10,
    cols: 60
  })) : test.questions.map(q => /*#__PURE__*/React.createElement("div", {
    key: q.id
  }, /*#__PURE__*/React.createElement("p", null, q.prompt), q.audio_url && /*#__PURE__*/React.createElement("audio", {
    controls: true,
    src: q.audio_url
  }), JSON.parse(q.options_json).map(opt => /*#__PURE__*/React.createElement("div", {
    className: "form-check",
    key: opt
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    className: "form-check-input",
    name: q.id,
    value: opt,
    onChange: e => setAnswers({
      ...answers,
      [q.id]: e.target.value
    })
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label"
  }, opt))))), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    className: "btn btn-primary mt-3",
    disabled: !started || timeLeft === 0
  }, "Submit"), score !== null && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Your score: ", score)), result && section === 'Writing' && /*#__PURE__*/React.createElement("pre", null, JSON.stringify(result.feedback, null, 2)), result && section !== 'Writing' && /*#__PURE__*/React.createElement("ul", null, result.answers.map(a => /*#__PURE__*/React.createElement("li", {
    key: a.question_id
  }, "Q", a.question_id, ": ", a.correct ? '✓' : '✗', " (you: ", a.response, ")")))));
}
