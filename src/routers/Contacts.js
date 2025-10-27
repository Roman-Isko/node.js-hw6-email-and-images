import express from 'express';
import * as contactsController from '../controllers/Contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/ContactSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAllContacts);
router.get('/:contactId', isValidId, contactsController.getContactById);
router.post(
  '/',
  validateBody(createContactSchema),
  contactsController.createContact,
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  contactsController.updateContact,
);
router.delete('/:contactId', isValidId, contactsController.deleteContact);

export default router;
