export default function Dashboard({
  user
}) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (!user) return;
    fetch(`/dashboard/${user.id}`).then(res => res.json()).then(setData);
  }, [user]);
  if (!user) return /*#__PURE__*/React.createElement("p", null, "Please create your profile.");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), data ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("pre", null, JSON.stringify(data, null, 2))) : /*#__PURE__*/React.createElement("p", null, "Loading..."));
}
