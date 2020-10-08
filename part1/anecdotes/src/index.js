import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(anecdotes.map(x => 0));
  const [highestPointsIndex, setHighestPointsIndex] = useState(0);

  for (const i of points) {
    if (i > points[highestPointsIndex])
      setHighestPointsIndex(points.indexOf(i));
  }

  const newAnecdote = () =>
    setSelected(Math.floor(Math.random() * anecdotes.length));

  const voteForAnecdote = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    return setPoints(newPoints);
  };

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <p>This anecdote has {points[selected]} votes.</p>
        <div>
          <Button handleClick={voteForAnecdote} text="Vote" />
          <Button handleClick={newAnecdote} text={"New Anecdote"} />
        </div>
      </div>
      <div>
        <h1>Highest-voted Anecdote</h1>
        <p>{anecdotes[highestPointsIndex]}</p>
        <p>This anecdote has {points[highestPointsIndex]} votes.</p>
      </div>
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
