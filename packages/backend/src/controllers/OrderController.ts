import { PrismaClient, Order, PickerLevel } from '@prisma/client';
import PickersController from './PickerController';


const OrdersController = {
  async getAllOrders(): Promise<Order[]> {
    const prisma = new PrismaClient();
    return prisma.order.findMany();
  },
  async getOrderByID(orderId: string) {
    const prisma = new PrismaClient();
    return prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
  },
  async getOrdersAssignedToPicker(pickerId: string) {
    const prisma = new PrismaClient();
    return prisma.order.findMany({
      where: {
        assigned_picker: {
          id: pickerId
        }
      }
    })
  },
  async pickOrder(orderId: string) {
    const prisma = new PrismaClient();
    // create a cart and assign it to the order, and change the order status to OrderStatus.PICKING
    const updatedOrder = prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: 'PICKING',
        cart: {
          create: {
            itemsDetails: [],
            order_id: orderId
            }
          }
        }
    });

    return updatedOrder;
  },
  async assignOrderToFirstLinePicker(orderId: string) {
    const prisma = new PrismaClient();
    const firstLinePicker = await PickersController.getPickerByLevel(PickerLevel.FIRST_LINE);

    if (!firstLinePicker) {
      throw new Error('No first line picker available');
    }

    const updatedOrder = prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        assigned_picker: {
          connect: {
            id: firstLinePicker.id
          }
        }
      }
    });

    return updatedOrder;
  },
  async assignOrderToSecondLinePicker(orderId: string) {
    const prisma = new PrismaClient();
    const secondLinePicker = await PickersController.getPickerByLevel(PickerLevel.SECOND_LINE);

    if (!secondLinePicker) {
      throw new Error('No second line picker available');
    }

    const updatedOrder = prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        assigned_picker: {
          connect: {
            id: secondLinePicker.id
          }
        }
      }
    });

    return updatedOrder;
  },
}

export default OrdersController;