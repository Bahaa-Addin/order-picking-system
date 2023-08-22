import { Router } from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import CartController from '../controllers/CartController';

const cartRoutes = Router();

cartRoutes.get('/', async (req, res) => {
  const carts = await CartController.getAllCarts();
  return res.status(HttpStatusCodes.OK).json({ carts });
});

cartRoutes.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  const cart = await CartController.getCartById(cartId);
  return res.status(HttpStatusCodes.OK).json({ cart });
});

cartRoutes.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const cart = await CartController.getCartByOrderID(orderId);
  return res.status(HttpStatusCodes.OK).json({ cart });
});

cartRoutes.post('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const cart = await CartController.createCart(orderId);
  return res.status(HttpStatusCodes.OK).json({ cart });
});

export default cartRoutes;
