import React from "react";

const ContactsIndexItem = ({ person }) => (
  <li>
    {person.name}: {person.number}
  </li>
);

export default ContactsIndexItem;
