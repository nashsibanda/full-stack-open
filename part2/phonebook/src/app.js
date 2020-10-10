import React, { useEffect, useState } from "react";
import ContactsIndex from "./components/contacts_index";
import NewContactForm from "./components/form";
import SearchField from "./components/search_field";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    personsService.getAll().then(contacts => setPersons(contacts));
  }, []);

  const addName = newPersonObj => {
    personsService
      .create(newPersonObj)
      .then(newPerson => setPersons(persons.concat(newPerson)));
  };

  const editPerson = existingPersonObj => {
    personsService
      .update(existingPersonObj.id, existingPersonObj)
      .then(editedPerson => {
        setPersons(
          persons.map(p =>
            p.id === existingPersonObj.id ? existingPersonObj : p
          )
        );
      });
  };

  const deleteContact = person => () => {
    if (window.confirm(`Do you really want to delete ${person.name}`)) {
      personsService
        .remove(person.id)
        .then(deletedPerson =>
          setPersons(persons.filter(({ id }) => id !== person.id))
        );
    }
  };

  const editSearchQuery = ({ target }) => {
    setSearchQuery(target.value);
  };

  const personsToDisplay = searchQuery
    ? persons.filter(person =>
        person.name.toLocaleLowerCase().includes(searchQuery)
      )
    : persons;

  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Add a new contact</h2>
      <NewContactForm
        handleSubmit={addName}
        persons={persons}
        handleEdit={editPerson}
      />
      <h2>Numbers</h2>
      <SearchField
        searchQuery={searchQuery}
        editSearchQuery={editSearchQuery}
      />
      <ContactsIndex persons={personsToDisplay} deleteContact={deleteContact} />
    </div>
  );
};

export default App;
