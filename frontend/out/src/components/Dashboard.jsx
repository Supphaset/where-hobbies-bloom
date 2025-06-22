const _jsxFileName = "frontend/src/components/Dashboard.jsx";export default function Dashboard({ user }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    fetch(`/dashboard/${user.id}`)
      .then(res => res.json())
      .then(setData);
  }, [user]);

  if (!user) return React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}, "Please create your profile."   );

  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
      , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}, "Dashboard")
      , data ? (
        React.createElement('div', { className: "row g-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
          , React.createElement('div', { className: "col-md-6 col-lg-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
            , React.createElement('div', { className: "card h-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
              , React.createElement('div', { className: "card-body", __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
                , React.createElement('h5', { className: "card-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}, "Exam Ready" )
                , React.createElement('ul', { className: "list-unstyled mb-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}, "IELTS: " , data.exam_ready.ielts ? 'Yes' : 'No')
                  , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "HSK: " , data.exam_ready.hsk ? 'Yes' : 'No')
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
            , React.createElement('div', { className: "card h-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
              , React.createElement('div', { className: "card-body", __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
                , React.createElement('h5', { className: "card-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, "Skill Profile" )
                , React.createElement('table', { className: "table table-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
                  , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
                    , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}, "Skill")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}, "Mastery %" )
                    )
                  )
                  , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
                    , data.skill_profile.map(p => (
                      React.createElement('tr', { key: p.skill, __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}, p.skill)
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}, p.pct.toFixed(1))
                      )
                    ))
                  )
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
            , React.createElement('div', { className: "card h-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
              , React.createElement('div', { className: "card-body", __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
                , React.createElement('h5', { className: "card-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, "Recommended Tasks" )
                , React.createElement('ul', { className: "mb-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
                  , data.recommended_tasks.map((t, i) => (
                    React.createElement('li', { key: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, t)
                  ))
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
            , React.createElement('div', { className: "card h-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
              , React.createElement('div', { className: "card-body", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
                , React.createElement('h5', { className: "card-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, "Recent Scores" )
                , React.createElement('ul', { className: "mb-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
                  , data.latest_scores.map((s, i) => (
                    React.createElement('li', { key: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, s.label, ": " , s.score.toFixed(1))
                  ))
                )
              )
            )
          )
          , React.createElement('div', { className: "col-md-6 col-lg-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
            , React.createElement('div', { className: "card h-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
              , React.createElement('div', { className: "card-body", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
                , React.createElement('h5', { className: "card-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "Study Time (Last 7 Days)"    )
                , React.createElement('ul', { className: "mb-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                  , data.study_time.map(item => (
                    React.createElement('li', { key: item.date, __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, item.date, ": " , item.minutes, "m")
                  ))
                )
              )
            )
          )
        )
      ) : (
        React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, "Loading...")
      )
    )
  );
}
