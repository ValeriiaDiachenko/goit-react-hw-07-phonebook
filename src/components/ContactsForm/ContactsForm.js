import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  useAddContactMutation,
  useGetContactsQuery,
} from 'redux/contactsSlice';
import { useFilter } from 'redux/filterSlice';
import { Form, Input } from './ContactsForm.styled';

const ContactsForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const { handleFilterReset } = useFilter();

  const [addContact, { isLoading }] = useAddContactMutation();
  const { data: contacts } = useGetContactsQuery();

  const handleFieldChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      default:
        throw new Error(name + 'field is not supported!');
    }
  };

  const handleAddContant = e => {
    e.preventDefault();

    if (contacts.find(c => c.name === name)) {
      toast.error(name + ' is already in contacts!');
      return;
    }

    addContact({ name, phone }).then(result =>
      !result.error
        ? toast.success('Contact added successfully')
        : toast.error('Failed to add contact, retry later!')
    );

    handleFilterReset();
    setName('');
    setPhone('');
  };

  return (
    <>
      <Toaster />
      <Form onSubmit={handleAddContant}>
        <label htmlFor="name">Name</label>
        <Input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleFieldChange}
          pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          required
        />
        <label htmlFor="phone">Number</label>
        <Input
          type="tel"
          name="phone"
          id="phone"
          value={phone}
          onChange={handleFieldChange}
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
        />
        <button type="submit" disabled={isLoading}>
          Add Contact
        </button>
      </Form>
    </>
  );
};

export default ContactsForm;