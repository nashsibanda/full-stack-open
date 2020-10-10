import React from "react";
import ContactsIndexItem from "./contacts_index_item";

const ContactsIndex = ({ persons, deleteContact }) => (
  <ul>
    {persons.map(person => (
      <ContactsIndexItem
        person={person}
        key={person.id}
        deleteContact={deleteContact}
      />
    ))}
  </ul>
);

export default ContactsIndex;
