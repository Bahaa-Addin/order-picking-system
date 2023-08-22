import { Router } from 'express';
import PickerController from '../controllers/PickerController';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { PickerLevel } from '@prisma/client';

const pickerRouter = Router();

pickerRouter.get('/', async (req, res) => {
  const pickers = await PickerController.getAllPickers();
  return res.status(HttpStatusCodes.OK).json({ pickers });
});

pickerRouter.get('/:pickerId', async (req, res) => {
  const { pickerId } = req.params;
  const picker = await PickerController.getPickerById(pickerId);
  return res.status(HttpStatusCodes.OK).json({ picker });
});

pickerRouter.get('/level/:pickerLevel', async (req, res) => {
  const { pickerLevel } = req.params;
  const picker = await PickerController.getPickerByLevel(pickerLevel as keyof typeof PickerLevel);
  return res.status(HttpStatusCodes.OK).json({ picker });
});

// get picker's assigned orders
pickerRouter.get('/:pickerId/orders', async (req, res) => {
  const { pickerId } = req.params;
  const orders = await PickerController.getPickerAssignedOrders(pickerId);
  return res.status(HttpStatusCodes.OK).json({ orders });
});

pickerRouter.post('/:pickerId/assign-order', async (req, res) => {
  const { pickerId } = req.params;
  const orderId = req.body.orderId;
  const picker = await PickerController.assignPickerToOrder(pickerId, orderId);
  return res.status(HttpStatusCodes.OK).json({ picker });
});

export default pickerRouter;