const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "1.15rem",
  height: "1.15rem",
  marginLeft: "0.35rem",
  padding: "0 0.35rem",
  borderRadius: "999px",
  border: "1px solid rgba(248, 113, 113, 0.35)",
  background: "rgba(248, 113, 113, 0.16)",
  color: "#fee2e2",
  fontSize: "0.7rem",
  fontWeight: 700,
  lineHeight: 1,
  verticalAlign: "middle",
};

export default function ChatRequestBadge({ count }) {
  if (!count) {
    return null;
  }

  return (
    <span aria-label={`${count} pending friend requests`} style={badgeStyle}>
      {count > 9 ? "9+" : count}
    </span>
  );
}