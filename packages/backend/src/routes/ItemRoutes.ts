import { Router } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import ItemController from '../controllers/ItemController';

const itemRoutes = Router();

itemRoutes.get('/', async (req, res) => {
  const items = await ItemController.getAllItems();
  return res.status(HttpStatusCodes.OK).json({ items });
});

itemRoutes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { itemDetails } = req.body;
  const item = await ItemController.updateItem(id, itemDetails);
  return res.status(HttpStatusCodes.OK).json({ item });
});

export default itemRoutes;