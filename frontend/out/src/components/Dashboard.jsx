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
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Exam Ready</h5>
                <ul className="list-unstyled mb-0">
                  <li>IELTS: {data.exam_ready.ielts ? 'Yes' : 'No'}</li>
                  <li>HSK: {data.exam_ready.hsk ? 'Yes' : 'No'}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Skill Profile</h5>
                <table className="table table-sm">
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
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Recommended Tasks</h5>
                <ul className="mb-0">
                  {data.recommended_tasks.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Recent Scores</h5>
                <ul className="mb-0">
                  {data.latest_scores.map((s, i) => (
                    <li key={i}>{s.label}: {s.score.toFixed(1)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Study Time (Last 7 Days)</h5>
                <ul className="mb-0">
                  {data.study_time.map(item => (
                    <li key={item.date}>{item.date}: {item.minutes}m</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
