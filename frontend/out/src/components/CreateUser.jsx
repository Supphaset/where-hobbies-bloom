export default function CreateUser({ onCreated }) {
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
    <form onSubmit={handleSubmit} className="mt-4">
      <h2 className="mb-3">Welcome to SoloLingua Coach</h2>
      <div className="mb-3">
        <label className="form-label">
          Name
          <input
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Target IELTS
          <input
            type="number"
            className="form-control"
            value={ielts}
            onChange={e => setIelts(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Target HSK
          <input
            type="number"
            className="form-control"
            value={hsk}
            onChange={e => setHsk(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary">Create Profile</button>
    </form>
  );
}
