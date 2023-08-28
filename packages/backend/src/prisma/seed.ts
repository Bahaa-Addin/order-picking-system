import {
  PrismaClient,
  Prisma,
  Picker,
  Item,
  Order,
  PickerLevel,
  ItemStatus,
  OrderStatus, Cart
} from '@prisma/client'
import { ObjectId } from 'bson';


const prisma = new PrismaClient()

const milkItemId = new ObjectId();
const eggsItemId = new ObjectId();
const breadItemId = new ObjectId();

const ITEMS = {
  [milkItemId.toString()]: {
    id: milkItemId.toString(),
    name: 'Milk',
    price: 15.99,
    quantity: 30,
    status: ItemStatus.IN_STOCK,
  },
  [eggsItemId.toString()]: {
    id: eggsItemId.toString(),
    name: 'Eggs',
    price: 199.99,
    quantity: 200,
    status: ItemStatus.IN_STOCK,
  },
  [breadItemId.toString()]: {
    id: breadItemId.toString(),
    name: 'Bread',
    price: 4.99,
    quantity: 50,
    status: ItemStatus.IN_STOCK,
  }

}
const pickersData: Prisma.PickerCreateInput[] = [
  {
    level: PickerLevel.FIRST_LINE,
  },
  {
    level: PickerLevel.SECOND_LINE,
  }
];

const itemsData: Prisma.ItemCreateInput[] = Object.values(ITEMS)
  .map(({ id, name, price, quantity, status }) => ({
    id, name, price, quantity, status
  }));

const ordersData: Prisma.OrderCreateInput[] = [
  // {
  //   customerName: 'John Doe',
  //   status: OrderStatus.PENDING,
  //   itemsDetails: [
  //     {
  //       itemId: milkItemId.toString(),
  //       name: ITEMS[milkItemId.toString()].name,
  //       quantity: 2
  //     },
  //     {
  //       itemId: breadItemId.toString(),
  //       name: ITEMS[breadItemId.toString()].name,
  //       quantity: 15
  //     }
  //   ]
  // },
  {
    customerName: 'Ben Gold',
    status: OrderStatus.PENDING,
    itemsDetails: [
      {
        item_id: milkItemId.toString(),
        name: ITEMS[milkItemId.toString()].name,
        quantity: 4,
        status: ItemStatus.IN_STOCK,
      },
      {
        item_id: eggsItemId.toString(),
        name: ITEMS[eggsItemId.toString()].name,
        quantity: 10,
        status: ItemStatus.IN_STOCK,
      },
      {
        item_id: breadItemId.toString(),
        name: ITEMS[breadItemId.toString()].name,
        quantity: 25,
        status: ItemStatus.IN_STOCK,
      }
    ]
  }
];

const cartItemsData: Prisma.CartCreateInput[] = [
  {
    order_id: ordersData[0].id,
    itemsDetails: [
    //   {
    //   item_id: milkItemId.toString(),
    //   name: ITEMS[milkItemId.toString()].name,
    //   quantity: 4
    // },
    // {
    //   item_id: breadItemId.toString(),
    //   name: ITEMS[breadItemId.toString()].name,
    //   quantity: 10
    // }
    ]
  }
]

// console.log(`Prisma`, prisma);
console.log(`Pickers`, pickersData);
console.log(`Items`, itemsData);

async function main() {
  console.log(`Start seeding ...`)

  const createdPickers = await Promise.all(
    pickersData.map(async pickerData => {
      const picker = await prisma.picker.create({
        data: pickerData,
      })
      console.log(`Created picker with id: ${picker.id}`)
      return picker as Picker;
  }))
  console.log(`Created pickers length:`, createdPickers.length);

  const createdItems = await Promise.all(
    itemsData.map(async itemData => {
      const item = await prisma.item.create({
        data: itemData,
      })
      console.log(`Created item with id: ${item.id}`)
      return item as Item;
    }
  ));
  console.log(`Created items length:`, createdItems.length);

  const createdOrders = await Promise.all(
    ordersData.map(async orderData => {
      const order = await prisma.order.create({
        data: {
          ...orderData,
          assigned_picker: {
            connect: {
              id: createdPickers.find(picker => picker.level === PickerLevel.FIRST_LINE)?.id
            }
          }
        },
      })
      console.log(`Created order with id: ${order.id}`)
      return order as Order;
    }
  ));
  console.log(`Created orders length:`, createdOrders.length);

  const createdCartItems = await Promise.all(
    cartItemsData.map(async cartItemData => {
      const createdCart = await prisma.cart.create({
        data: {
          ...cartItemData,
          order: {
            connect: {
              id: createdOrders[0].id
            }
          }
        },
      })
      console.log(`Created cart item with id: ${createdCart.id}`)
      return createdCart as Cart;
    })
  );
  console.log(`Created cart items length:`, createdCartItems.length);

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })