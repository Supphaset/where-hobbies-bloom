export default function Dashboard({ user }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    fetch(`/dashboard/${user.id}`)
      .then(res => res.json())
      .then(setData);
  }, [user]);

  if (!user) return React.createElement('p', {} , "Please create your profile."   );

  return (
    React.createElement('div', {} 
      , React.createElement('h2', {} , "Dashboard")
      , data ? (
        React.createElement('div', { className: "row g-3" }
          , React.createElement('div', { className: "col-md-6 col-lg-4" }
            , React.createElement('div', { className: "card h-100" }
              , React.createElement('div', { className: "card-body"}
                , React.createElement('h5', { className: "card-title"}, "Exam Ready" )
                , React.createElement('ul', { className: "list-unstyled mb-0" }
                  , React.createElement('li', {} , "IELTS: " , data.exam_ready.ielts ? 'Yes' : 'No')
                  , React.createElement('li', {} , "HSK: " , data.exam_ready.hsk ? 'Yes' : 'No')
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" }
            , React.createElement('div', { className: "card h-100" }
              , React.createElement('div', { className: "card-body"}
                , React.createElement('h5', { className: "card-title"}, "Skill Profile" )
                , React.createElement('table', { className: "table table-sm" }
                  , React.createElement('thead', {} 
                    , React.createElement('tr', {} 
                      , React.createElement('th', {} , "Skill")
                      , React.createElement('th', {} , "Mastery %" )
                    )
                  )
                  , React.createElement('tbody', {} 
                    , data.skill_profile.map(p => (
                      React.createElement('tr', { key: p.skill}
                        , React.createElement('td', {} , p.skill)
                        , React.createElement('td', {} , p.pct.toFixed(1))
                      )
                    ))
                  )
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" }
            , React.createElement('div', { className: "card h-100" }
              , React.createElement('div', { className: "card-body"}
                , React.createElement('h5', { className: "card-title"}, "Recommended Tasks" )
                , React.createElement('ul', { className: "mb-0"}
                  , data.recommended_tasks.map((t, i) => (
                    React.createElement('li', { key: i}, t)
                  ))
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" }
            , React.createElement('div', { className: "card h-100" }
              , React.createElement('div', { className: "card-body"}
                , React.createElement('h5', { className: "card-title"}, "Recent Scores" )
                , React.createElement('ul', { className: "mb-0"}
                  , data.latest_scores.map((s, i) => (
                    React.createElement('li', { key: i}, s.label, ": " , s.score.toFixed(1))
                  ))
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" }
            , React.createElement('div', { className: "card h-100" }
              , React.createElement('div', { className: "card-body"}
                , React.createElement('h5', { className: "card-title"}, "Study Time (Last 7 Days)"    )
                , React.createElement('ul', { className: "mb-0"}
                  , data.study_time.map(item => (
                    React.createElement('li', { key: item.date}, item.date, ": " , item.minutes, "m")
                  ))
                )
              )
            )
          )
        )
      ) : (
        React.createElement('p', {} , "Loading...")
      )
    )
  );
}
