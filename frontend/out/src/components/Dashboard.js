"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

exports["default"] = Dashboard;

function Dashboard(_ref) {
  var user = _ref.user;

  var _React$useState = React.useState(null);

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var data = _React$useState2[0];
  var setData = _React$useState2[1];

  React.useEffect(function () {
    if (!user) return;
    fetch("/dashboard/" + user.id).then(function (res) {
      return res.json();
    }).then(setData);
  }, [user]);

  if (!user) return React.createElement(
    "p",
    null,
    "Please create your profile."
  );

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      null,
      "Dashboard"
    ),
    data ? React.createElement(
      "div",
      { className: "row g-3" },
      React.createElement(
        "div",
        { className: "col-md-6 col-lg-4" },
        React.createElement(
          "div",
          { className: "card h-100" },
          React.createElement(
            "div",
            { className: "card-body" },
            React.createElement(
              "h5",
              { className: "card-title" },
              "Exam Ready"
            ),
            React.createElement(
              "ul",
              { className: "list-unstyled mb-0" },
              React.createElement(
                "li",
                null,
                "IELTS: ",
                data.exam_ready.ielts ? 'Yes' : 'No'
              ),
              React.createElement(
                "li",
                null,
                "HSK: ",
                data.exam_ready.hsk ? 'Yes' : 'No'
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-6 col-lg-4" },
        React.createElement(
          "div",
          { className: "card h-100" },
          React.createElement(
            "div",
            { className: "card-body" },
            React.createElement(
              "h5",
              { className: "card-title" },
              "Skill Profile"
            ),
            React.createElement(
              "table",
              { className: "table table-sm" },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement(
                    "th",
                    null,
                    "Skill"
                  ),
                  React.createElement(
                    "th",
                    null,
                    "Mastery %"
                  )
                )
              ),
              React.createElement(
                "tbody",
                null,
                data.skill_profile.map(function (p) {
                  return React.createElement(
                    "tr",
                    { key: p.skill },
                    React.createElement(
                      "td",
                      null,
                      p.skill
                    ),
                    React.createElement(
                      "td",
                      null,
                      p.pct.toFixed(1)
                    )
                  );
                })
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-6 col-lg-4" },
        React.createElement(
          "div",
          { className: "card h-100" },
          React.createElement(
            "div",
            { className: "card-body" },
            React.createElement(
              "h5",
              { className: "card-title" },
              "Recommended Tasks"
            ),
            React.createElement(
              "ul",
              { className: "mb-0" },
              data.recommended_tasks.map(function (t, i) {
                return React.createElement(
                  "li",
                  { key: i },
                  t
                );
              })
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-6 col-lg-4" },
        React.createElement(
          "div",
          { className: "card h-100" },
          React.createElement(
            "div",
            { className: "card-body" },
            React.createElement(
              "h5",
              { className: "card-title" },
              "Recent Scores"
            ),
            React.createElement(
              "ul",
              { className: "mb-0" },
              data.latest_scores.map(function (s, i) {
                return React.createElement(
                  "li",
                  { key: i },
                  s.label,
                  ": ",
                  s.score.toFixed(1)
                );
              })
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-6 col-lg-4" },
        React.createElement(
          "div",
          { className: "card h-100" },
          React.createElement(
            "div",
            { className: "card-body" },
            React.createElement(
              "h5",
              { className: "card-title" },
              "Study Time (Last 7 Days)"
            ),
            React.createElement(
              "ul",
              { className: "mb-0" },
              data.study_time.map(function (item) {
                return React.createElement(
                  "li",
                  { key: item.date },
                  item.date,
                  ": ",
                  item.minutes,
                  "m"
                );
              })
            )
          )
        )
      )
    ) : React.createElement(
      "p",
      null,
      "Loading..."
    )
  );
}

module.exports = exports["default"];
