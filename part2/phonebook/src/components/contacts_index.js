import React from "react";
import ContactsIndexItem from "./contacts_index_item";

const ContactsIndex = ({ persons }) => (
  <ul>
    {persons.map(person => (
      <ContactsIndexItem person={person} key={person.name} />
    ))}
  </ul>
);

export default ContactsIndex;
