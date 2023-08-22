import { Router } from 'express';
import OrdersController from '../controllers/OrderController';
import HttpStatusCodes from '../constants/HttpStatusCodes';

const orderRouter = Router();

orderRouter.get('/', async (req, res) => {
  const orders = await OrdersController.getAllOrders();
  console.log({ orders });
  return res.status(HttpStatusCodes.OK).json({ orders });
});

orderRouter.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = await OrdersController.getOrderByID(orderId);
  return res.status(HttpStatusCodes.OK).json({ order });
});

// get orders by picker
orderRouter.get('/picker-orders/:pickerId', async (req, res) => {
  const { pickerId } = req.params;
  const orders = await OrdersController.getOrdersAssignedToPicker(pickerId);
  return res.status(HttpStatusCodes.OK).json({ orders });
});

orderRouter.post('/:orderId/pick', async (req, res) => {
  const { orderId } = req.params;
  const order = await OrdersController.pickOrder(orderId);
  return res.status(HttpStatusCodes.OK).json({ order });
});

orderRouter.post('/:orderId/delegate', async (req, res) => {
  const { orderId } = req.params;
  const order = await OrdersController.assignOrderToSecondLinePicker(orderId);
  return res.status(HttpStatusCodes.OK).json({ order });
});

export default orderRouter;
