import { PrismaClient, Cart, CartStatus } from '@prisma/client';
import ItemController from './ItemController';

const CartsController  = {
  async getAllCarts(): Promise<Cart[]> {
    const prisma = new PrismaClient();
    return prisma.cart.findMany();
  },
  async getCartById(cartId: string) {
    const prisma = new PrismaClient();
    return prisma.cart.findUnique({
      where: {
        id: cartId
      }
    });
  },
  async getCartByOrderID(orderId: string) {
    const prisma = new PrismaClient();
    return prisma.cart.findUnique({
      where: {
        order_id: orderId
      }
    });
  },
  async createCart(orderId: string) {
    const prisma = new PrismaClient();
    const cart = prisma.cart.create({
      data: {
        order_id: orderId,
      }
    });
    return cart;
  },
  async changeCartStatusToComplete(cartId: string) {
    const prisma = new PrismaClient();
    const updatedCart = prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        status: CartStatus.COMPLETE
      }
    });

    return updatedCart;
  },
  async changeCartStatusToMissingItems(cartId: string) {
    const prisma = new PrismaClient();
    // patch the cart status to MISSING_ITEMS
    const updatedCart = prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        status: CartStatus.MISSING_ITEMS
      }
    })
    return updatedCart;
  },
  async addItemToCart(cartId: string, itemId: string, quantity: number) {
    const prisma = new PrismaClient();
    // // console.log('cartId', cartId, 'itemId', itemId, 'quantity', quantity);
    const { name, status } = (await ItemController.getItemById(itemId))!;
    // console.log('name', name, 'status', status);
    const updatedCart = prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        itemsDetails: {
          push: {
            item_id: itemId,
            name,
            quantity,
            status
          }
        }
      }
    });
    return updatedCart;
  }
}

export default CartsController;