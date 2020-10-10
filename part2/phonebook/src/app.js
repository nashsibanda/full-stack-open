import React, { useState } from "react";
import ContactsIndex from "./components/contacts_index";
import NewContactForm from "./components/form";
import SearchField from "./components/search_field";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

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
