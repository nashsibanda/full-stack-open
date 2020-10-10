import React, { useState } from "react";

const NewContactForm = ({ handleSubmit, persons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const editNewName = ({ target }) => {
    setNewName(target.value);
  };

  const editNewNumber = ({ target }) => {
    setNewNumber(target.value);
  };

  const validateAndSubmit = event => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already in this phonebook!`);
    } else if (newNumber === "") {
      alert("Phone number can't be blank!");
    } else {
      const newPersonObj = {
        name: newName,
        number: newNumber,
      };
      handleSubmit(newPersonObj);
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <form onSubmit={validateAndSubmit}>
      <div>
        name: <input type="text" value={newName} onChange={editNewName} />
      </div>
      <div>
        phone number:{" "}
        <input type="number" value={newNumber} onChange={editNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default NewContactForm;
