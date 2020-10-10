import Axios from "axios";
import React, { useEffect, useState } from "react";
import ContactsIndex from "./components/contacts_index";
import NewContactForm from "./components/form";
import SearchField from "./components/search_field";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/persons").then(response => {
      setPersons(response.data);
    });
  }, []);

  const addName = newPersonObj => {
    setPersons(persons.concat(newPersonObj));
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
      <NewContactForm handleSubmit={addName} persons={persons} />
      <h2>Numbers</h2>
      <SearchField
        searchQuery={searchQuery}
        editSearchQuery={editSearchQuery}
      />
      <ContactsIndex persons={personsToDisplay} />
    </div>
  );
};

export default App;
