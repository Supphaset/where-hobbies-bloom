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
    onSubmit: handleSubmit,
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-3"
  }, "Welcome to SoloLingua Coach"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Name", /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    value: name,
    onChange: e => setName(e.target.value),
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Target IELTS", /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    value: ielts,
    onChange: e => setIelts(e.target.value),
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Target HSK", /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    value: hsk,
    onChange: e => setHsk(e.target.value),
    required: true
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Create Profile"));
}
