import React, { useEffect, useRef, useState } from "react";
import ContactsIndex from "./components/contacts_index";
import NewContactForm from "./components/form";
import Notification from "./components/notification";
import SearchField from "./components/search_field";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(notifications);
  notifRef.current = notifications;

  useEffect(() => {
    personsService.getAll().then(contacts => setPersons(contacts));
  }, []);

  const addName = newPersonObj => {
    personsService.create(newPersonObj).then(newPerson => {
      setPersons(persons.concat(newPerson));
      const addSuccessNotif = {
        message: `${newPerson.name} has been successfully added!`,
        type: "success",
      };
      addNotification(addSuccessNotif);
    });
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
        const updateSuccessNotif = {
          message: `${existingPersonObj.name} has been successfully updated!`,
          type: "success",
        };
        addNotification(updateSuccessNotif);
      })
      .catch(error => {
        const alreadyDeletedNotif = {
          message: `${existingPersonObj.name} was already removed from the server!`,
          type: "error",
        };
        addNotification(alreadyDeletedNotif);
      });
  };

  const addNotification = newNotification => {
    const notifIds = notifications.map(n => n.id).sort((a, b) => b - a);
    const newNotifId = notifIds.length > 0 ? notifIds[0] + 1 : 1;
    const newNotifObj = { ...newNotification, id: newNotifId };
    setNotifications(notifications.concat(newNotifObj));
    setTimeout(() => clearNotification(newNotifId), 5000);
  };

  const clearNotification = id => {
    setNotifications(notifRef.current.filter(n => n.id !== id));
  };

  const deleteContact = person => () => {
    if (window.confirm(`Do you really want to delete ${person.name}`)) {
      personsService
        .remove(person.id)
        .then(deletedPerson => {
          setPersons(persons.filter(({ id }) => id !== person.id));
          const deleteSuccessNotif = {
            message: `${person.name} has been successfully deleted!`,
            type: "success",
          };
          addNotification(deleteSuccessNotif);
        })
        .catch(error => {
          const alreadyDeletedNotif = {
            message: `${person.name} was already removed from the server!`,
            type: "error",
          };
          addNotification(alreadyDeletedNotif);
        });
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
      {notifications.map(n => (
        <Notification notification={n} key={n.id} />
      ))}
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
