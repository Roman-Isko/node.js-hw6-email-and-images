import createHttpError from 'http-errors';
import * as contactsService from '../services/Contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const filter = { userId };
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const totalItems = await contactsService.countContacts(filter);
    const contacts = await contactsService.getPaginatedContacts({
      filter,
      sort,
      skip,
      limit,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: parseInt(page),
        perPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasPreviousPage: parseInt(page) > 1,
        hasNextPage: skip + contacts.length < totalItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await contactsService.getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully fetched contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newContact = await contactsService.createContact({
      ...req.body,
      userId,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const updated = await contactsService.updateContact(
      contactId,
      req.body,
      userId,
    );

    if (!updated) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const deleted = await contactsService.deleteContact(contactId, userId);

    if (!deleted) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
