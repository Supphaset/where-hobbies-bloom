export default function Dashboard({
  user
}) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (!user) return;
    fetch(`/dashboard/${user.id}`).then(res => res.json()).then(setData);
  }, [user]);
  if (!user) return /*#__PURE__*/React.createElement("p", null, "Please create your profile.");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), data ? /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Exam Ready"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled mb-0"
  }, /*#__PURE__*/React.createElement("li", null, "IELTS: ", data.exam_ready.ielts ? 'Yes' : 'No'), /*#__PURE__*/React.createElement("li", null, "HSK: ", data.exam_ready.hsk ? 'Yes' : 'No'))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Skill Profile"), /*#__PURE__*/React.createElement("table", {
    className: "table table-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Skill"), /*#__PURE__*/React.createElement("th", null, "Mastery %"))), /*#__PURE__*/React.createElement("tbody", null, data.skill_profile.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.skill
  }, /*#__PURE__*/React.createElement("td", null, p.skill), /*#__PURE__*/React.createElement("td", null, p.pct.toFixed(1))))))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Recommended Tasks"), /*#__PURE__*/React.createElement("ul", {
    className: "mb-0"
  }, data.recommended_tasks.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Recent Scores"), /*#__PURE__*/React.createElement("ul", {
    className: "mb-0"
  }, data.latest_scores.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, s.label, ": ", s.score.toFixed(1))))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Study Time (Last 7 Days)"), /*#__PURE__*/React.createElement("ul", {
    className: "mb-0"
  }, data.study_time.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.date
  }, item.date, ": ", item.minutes, "m"))))))) : /*#__PURE__*/React.createElement("p", null, "Loading..."));
}
