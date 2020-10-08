import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);
const Statistic = ({ name, value }) => (
  <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const averageValue = () => (good * 1 - bad * 1) / (good + bad + neutral);

  const positivePercentage = () => (good / (good + bad + neutral)) * 100;

  return (
    <table>
      <tbody>
        <Statistic name="good" value={good} />
        <Statistic name="neutral" value={neutral} />
        <Statistic name="bad" value={bad} />
        <Statistic name="total" value={good + neutral + bad} />
        <Statistic name="average" value={averageValue()} />
        <Statistic name="positive" value={`${positivePercentage()}%`} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementValue = value => {
    switch (value) {
      case "good":
        return () => setGood(good + 1);
      case "neutral":
        return () => setNeutral(neutral + 1);
      case "bad":
        return () => setBad(bad + 1);
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button text="good" handleClick={incrementValue("good")} />
        <Button text="neutral" handleClick={incrementValue("neutral")} />
        <Button text="bad" handleClick={incrementValue("bad")} />
      </div>
      <h1>statistic</h1>
      {good + neutral + bad ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        <div>No feedback given</div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
