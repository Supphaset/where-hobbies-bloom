export default function Dashboard({ user }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    fetch(`/dashboard/${user.id}`)
      .then(res => res.json())
      .then(setData);
  }, [user]);

  if (!user) return <p>Please create your profile.</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      {data ? (
        <div>
          <h3>Exam Ready</h3>
          <ul>
            <li>IELTS: {data.exam_ready.ielts ? 'Yes' : 'No'}</li>
            <li>HSK: {data.exam_ready.hsk ? 'Yes' : 'No'}</li>
          </ul>
          <h3>Skill Profile</h3>
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Mastery %</th>
              </tr>
            </thead>
            <tbody>
              {data.skill_profile.map(p => (
                <tr key={p.skill}>
                  <td>{p.skill}</td>
                  <td>{p.pct.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
