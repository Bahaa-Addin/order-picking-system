import { connectDb } from '../db';
import { ChangeStreamUpdateDocument } from 'mongodb';
import { PrismaClient } from '@prisma/client';

export default async function listenToCartChanges() {
  const dbObject = await connectDb('test')

  const cartCollection = dbObject.collection("Cart");

  const cartChangeStream = cartCollection.watch([], { fullDocument: "updateLookup", fullDocumentBeforeChange: "whenAvailable" });

  cartChangeStream.on("change", (next: ChangeStreamUpdateDocument) => {
    // process any change event
    console.log("received a change to the collection: \t", (next));
    const { operationType,
      // fullDocument,
      updateDescription } = next;

    if (updateDescription === undefined) return;

    const { updatedFields } = updateDescription;
    console.log('updatedFields', updatedFields);

    const prisma = new PrismaClient();
    Object.entries(updatedFields as { [s: string]: any; }).forEach(async ([key, value]) => {
      if (key.includes('itemsDetails')) {
        console.log(operationType, 'document', value);
        if (Array.isArray(value)) {
          value = value[0];
        }
        let { _id, name, quantity, status } = value;
        console.log('_id', _id, 'name', name, 'quantity', quantity, 'status', status);

        if (_id) {
          // make prisma query to subtract the quantity from the item in the Item collection within a transaction session
          const findItemPromise = prisma.item.findUnique({
            where: {
              id: _id
            }
          })

          const foundItem = await findItemPromise;
          // if the quantity of the value item is bigger than the quantity of the item in the Item collection, then throw an error
          if (Number(foundItem!.quantity) < Number(quantity)) {
            throw new Error('Not enough items in stock');
          }

          const quantityAfterUpdate = Number(foundItem!.quantity) - Number(quantity);

          // if the quantity after the update is 0, then change the status of the item to OUT_OF_STOCK
          if (quantityAfterUpdate === 0) {
            status = 'OUT_OF_STOCK';
          }

          console.log('foundItem', foundItem);
          console.log('quantityAfterUpdate', quantityAfterUpdate);

          const updatedItemPromise = prisma.item.update({
            where: {
              id: _id
            },
            data: {
              quantity: quantityAfterUpdate,
              status
            }
          });

          await prisma.$transaction([findItemPromise, updatedItemPromise])
        }
      }
    });
  });

}
