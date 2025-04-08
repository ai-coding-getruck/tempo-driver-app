import React from "react";

const Home = () => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>Driver Assignment Tracker</h1>
      <p>Welcome to the Driver Assignment Tracker application.</p>
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <h2>Features</h2>
        <ul>
          <li>View assigned routes</li>
          <li>Manage tasks</li>
          <li>Complete assignments</li>
          <li>Submit forms with photos</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
