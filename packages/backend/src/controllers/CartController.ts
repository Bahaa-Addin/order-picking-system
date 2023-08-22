import { PrismaClient, Cart, CartStatus } from '@prisma/client';

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
    const updatedCart = prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        status: CartStatus.MISSING_ITEMS
      }
    });
    return updatedCart;
  }
}

export default CartsController;