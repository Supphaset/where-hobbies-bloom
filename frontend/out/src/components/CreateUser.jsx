export default function CreateUser({
  onCreated
}) {
  const [name, setName] = React.useState('');
  const [ielts, setIelts] = React.useState(6);
  const [hsk, setHsk] = React.useState(180);
  const handleSubmit = e => {
    e.preventDefault();
    fetch('/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        target_ielts: parseInt(ielts),
        target_hsk: parseInt(hsk)
      })
    }).then(res => res.json()).then(user => {
      localStorage.setItem('sololingua_user', JSON.stringify(user));
      onCreated(user);
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("h2", null, "Welcome to SoloLingua Coach"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Name: ", /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    required: true
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Target IELTS: ", /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: ielts,
    onChange: e => setIelts(e.target.value),
    required: true
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Target HSK: ", /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: hsk,
    onChange: e => setHsk(e.target.value),
    required: true
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Create Profile"));
}
