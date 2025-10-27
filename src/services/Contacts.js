import Contact from '../models/Contacts.js';

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, data, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
  });
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

export const countContacts = async (filter = {}) => {
  return await Contact.countDocuments(filter);
};

export const getPaginatedContacts = async ({
  filter = {},
  sort = {},
  skip = 0,
  limit = 10,
}) => {
  return await Contact.find(filter).sort(sort).skip(skip).limit(limit);
};
