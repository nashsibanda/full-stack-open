import React from "react";

const Notification = ({ notification }) => {
  const notificationStyle = type => {
    const notifColor =
      type === "success" ? "green" : type === "error" ? "red" : "blue";
    return {
      color: notifColor,
      padding: "0.5rem 1rem",
      border: `4px solid ${notifColor}`,
      background: "#eee",
    };
  };

  return (
    notification && (
      <div style={notificationStyle(notification.type)}>
        {notification.message}
      </div>
    )
  );
};

export default Notification;
