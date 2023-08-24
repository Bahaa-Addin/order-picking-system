import * as Realm from "realm-web";

const REALM_APP_ID = "order-picker-qibcs"; // e.g. myapp-abcde

// Add your App ID
const app = new Realm.App({ id: REALM_APP_ID });

// Create an anonymous credential
const credentials = Realm.Credentials.anonymous();

// Authenticate the user
const user = await app.logIn(credentials);
// `App.currentUser` updates to match the logged in user
console.assert(user.id === app.currentUser!.id);

// export class ItemSchema extends Realm.Object {
//   static schema = {
//     name: "Item",
//     primaryKey: "_id",
//     properties: {
//       _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
//       name: "string",
//       price: "float",
//       quantity: "int",
//       status: "string",
//     },
//   };
// }


export async function subscribeToItems(onChange: (items: any) => void) {
  // const config = {
  //   id: REALM_APP_ID,
  //   baseUrl: "https://realm.mongodb.com",
  //   headers: {
  //     Authorization: `Bearer ${user.accessToken}`,
  //   },
  //   schema: [ItemSchema],
  //   sync: {
  //     user,
  //     flexible: true,
  //   }
  // }
  const  mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const  collection = mongodb.db('test').collection('Item');
  // const realm = await app.openRealm(config);
  // const collection = realm.collection("Item");

  console.log('subscribed to items');
  for  await (const  change  of  collection.watch()) {
    onChange(change);
  }

  // const changeStream = collection.watch();
  // changeStream.addListener(onChange);

  // console.log('subscribed to items');

  // await realm.subscriptions.update((subs: any) => {
  //   const items = realm
  //     .objects(ItemSchema)
  //     // .filtered('name == "Clifford" && age > 5');
  //   subs.add(items);
  // });

}
