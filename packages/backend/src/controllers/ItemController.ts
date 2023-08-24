import { PrismaClient, Item, ItemDetails } from '@prisma/client';

const ItemsController = {
  async getAllItems(): Promise<Item[]> {
    const prisma = new PrismaClient();
    return prisma.item.findMany();
  },
  async getItemById(itemId: string) {
    const prisma = new PrismaClient();
    return prisma.item.findUnique({
      where: {
        id: itemId
      }
    });
  },
  async updateItem(itemId: string, itemDetails: ItemDetails) {
    const prisma = new PrismaClient();

    const updatedItem = prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        ...itemDetails
      }
    });

    return updatedItem;
  }
}

export default ItemsController;