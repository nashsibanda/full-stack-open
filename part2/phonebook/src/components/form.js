import React, { useState } from "react";

const NewContactForm = ({ handleSubmit, persons, handleEdit }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const formStyle = {
    marginBottom: "1rem",
  };

  const editNewName = ({ target }) => {
    setNewName(target.value);
  };

  const editNewNumber = ({ target }) => {
    setNewNumber(target.value);
  };

  const validateAndSubmit = event => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(newName)) {
      // alert(`${newName} is already in this phonebook!`);
      if (
        window.confirm(
          `${newName} is already in this phonebook. Replace the number with this one?`
        )
      ) {
        const existingPerson = persons.find(p => p.name === newName);
        const editedPersonObj = {
          ...existingPerson,
          number: newNumber,
        };
        handleEdit(editedPersonObj);
        setNewName("");
        setNewNumber("");
      }
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
    <form onSubmit={validateAndSubmit} style={formStyle}>
      <div>
        name: <input type="text" value={newName} onChange={editNewName} />
      </div>
      <div>
        phone number:{" "}
        <input type="text" value={newNumber} onChange={editNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default NewContactForm;
