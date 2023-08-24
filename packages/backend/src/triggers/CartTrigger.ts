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

    const prisma = new PrismaClient();
    Object.entries(updatedFields as { [s: string]: any; }).forEach(async ([key, value]) => {
      if (key.includes('itemsDetails')) {
        console.log(operationType, 'document', value);
        const { _id, name, quantity } = value;
        console.log('_id', _id, 'name', name, 'quantity', quantity )
        if (_id) {
          // make prisma query to subtract the quantity from the item in the Item collection within a transaction session
          const findItemPromise = prisma.item.findUnique({
            where: {
              id: _id
            }
          })

          const foundItem = await findItemPromise;
          const quantityAfterUpdate = Number(foundItem!.quantity) - Number(quantity);
          console.log('foundItem', foundItem);
          console.log('quantityAfterUpdate', quantityAfterUpdate);

          const updatedItemPromise = prisma.item.update({
            where: {
              id: _id
            },
            data: {
              quantity: quantityAfterUpdate
            }
          });

          await prisma.$transaction([findItemPromise, updatedItemPromise])
        }
      }
    });
  });

}
