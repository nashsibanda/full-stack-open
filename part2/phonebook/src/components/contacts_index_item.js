import React from "react";

const ContactsIndexItem = ({ person, deleteContact }) => (
  <li>
    {person.name}: {person.number} -{" "}
    <button onClick={deleteContact(person)}>Delete</button>
  </li>
);

export default ContactsIndexItem;
