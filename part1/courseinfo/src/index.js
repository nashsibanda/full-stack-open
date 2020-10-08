import React from "react";
import ReactDOM from "react-dom";

const Header = props => (
  <header>
    <h1>{props.course}</h1>
  </header>
);

const Content = props => (
  <div>
    <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} />
  </div>
);

const Part = props => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = props => <p>Number of exercises {props.total}</p>;

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={course.parts.reduce((acc, cur) => acc + cur.exercises, 0)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
