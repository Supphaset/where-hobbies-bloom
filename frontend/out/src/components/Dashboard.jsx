export default function Dashboard({
  user
}) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (!user) return;
    fetch(`/dashboard/${user.id}`).then(res => res.json()).then(setData);
  }, [user]);
  if (!user) return /*#__PURE__*/React.createElement("p", null, "Please create your profile.");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), data ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Exam Ready"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "IELTS: ", data.exam_ready.ielts ? "Yes" : "No"), /*#__PURE__*/React.createElement("li", null, "HSK: ", data.exam_ready.hsk ? "Yes" : "No")), /*#__PURE__*/React.createElement("h3", null, "Skill Profile"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Skill"), /*#__PURE__*/React.createElement("th", null, "Mastery %"))), /*#__PURE__*/React.createElement("tbody", null, data.skill_profile.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.skill
  }, /*#__PURE__*/React.createElement("td", null, p.skill), /*#__PURE__*/React.createElement("td", null, p.pct.toFixed(1))))))) : /*#__PURE__*/React.createElement("p", null, "Loading..."));
}
