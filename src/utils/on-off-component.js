function OnOffComponent(props) {
  return (
    <div
      className={`on-off-status-display ${props.value === true ? "on" : "off"}`}
    >
      &nbsp;
    </div>
  );
}

export default OnOffComponent;
