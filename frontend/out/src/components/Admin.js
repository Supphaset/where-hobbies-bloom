export default function Admin() {
  const [file, setFile] = React.useState(null);
  const [status, setStatus] = React.useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    fetch('/admin/import', {
      method: 'POST',
      body: form
    }).then(res => res.ok ? res.json() : Promise.reject()).then(() => setStatus('Import successful')).catch(() => setStatus('Import failed'));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-3"
  }, "Admin"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "application/json",
    onChange: e => setFile(e.target.files[0]),
    className: "form-control"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Import Content")), status && /*#__PURE__*/React.createElement("p", {
    className: "mt-2"
  }, status));
}