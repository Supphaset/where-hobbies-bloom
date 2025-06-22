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
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => setStatus('Import successful'))
      .catch(() => setStatus('Import failed'));
  };

  return (
    <div className="mt-4">
      <h2 className="mb-3">Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="file" accept="application/json" onChange={e => setFile(e.target.files[0])} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Import Content</button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
