
const _jsxFileName = "frontend/src/components/CreateUser.jsx";export default function CreateUser({ onCreated }) {
  const [name, setName] = React.useState('');
  const [ielts, setIelts] = React.useState(6);
  const [hsk, setHsk] = React.useState(180);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, target_ielts: parseInt(ielts), target_hsk: parseInt(hsk) })
    })
      .then(res => res.json())
      .then(user => {
        localStorage.setItem('sololingua_user', JSON.stringify(user));
        onCreated(user);
      });
  };

  return (
    React.createElement('form', { onSubmit: handleSubmit, className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
      , React.createElement('h2', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Welcome to SoloLingua Coach"   )
      , React.createElement('div', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
        , React.createElement('label', { className: "form-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "Name"

          , React.createElement('input', {
            className: "form-control",
            value: name,
            onChange: e => setName(e.target.value),
            required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
          )
        )
      )
      , React.createElement('div', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
        , React.createElement('label', { className: "form-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}, "Target IELTS"

          , React.createElement('input', {
            type: "number",
            className: "form-control",
            value: ielts,
            onChange: e => setIelts(e.target.value),
            required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
          )
        )
      )
      , React.createElement('div', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
        , React.createElement('label', { className: "form-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, "Target HSK"

          , React.createElement('input', {
            type: "number",
            className: "form-control",
            value: hsk,
            onChange: e => setHsk(e.target.value),
            required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
          )
        )
      )
      , React.createElement('button', { type: "submit", className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, "Create Profile" )
    )
  );
}
