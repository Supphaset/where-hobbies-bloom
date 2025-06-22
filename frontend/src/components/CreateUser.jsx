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
    <form onSubmit={handleSubmit}>
      <h2>Welcome to SoloLingua Coach</h2>
      <div>
        <label>Name: <input value={name} onChange={e => setName(e.target.value)} required /></label>
      </div>
      <div>
        <label>Target IELTS: <input type="number" value={ielts} onChange={e => setIelts(e.target.value)} required /></label>
      </div>
      <div>
        <label>Target HSK: <input type="number" value={hsk} onChange={e => setHsk(e.target.value)} required /></label>
      </div>
      <button type="submit">Create Profile</button>
    </form>
  );
}
