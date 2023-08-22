import { PrismaClient, Picker, PickerLevel } from '@prisma/client';

const PickersController  = {
   async getAllPickers(): Promise<Picker[]> {
    const prisma = new PrismaClient();
    return prisma.picker.findMany();
  },
  async getPickerById(pickerId: string) {
    const prisma = new PrismaClient();
    return prisma.picker.findUnique({
      where: {
        id: pickerId
      }
    })
  },
  async getPickerByLevel(pickerLevel: keyof typeof PickerLevel) {
    const prisma = new PrismaClient();
    const picker = prisma.picker.findFirst({
      where: {
        level: pickerLevel
      }
    })

    return picker;
  },
  async getPickerAssignedOrders(pickerId: string) {
    const prisma = new PrismaClient();
    return prisma.picker.findUnique({
      where: {
        id: pickerId
      },
      include: {
        assigned_orders: true
      }
    })
  },
  async assignPickerToOrder(pickerId: string, orderId: string) {
     const prisma = new PrismaClient();
      const updatedPicker = prisma.picker.update({
        where: {
          id: pickerId,
        },
        data: {
          assigned_orders: {
            connect: {
              id: orderId
            }
          }
        }
      });

      return updatedPicker;
  }
}

export default PickersController;