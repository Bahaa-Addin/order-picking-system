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


export async function subscribeToCart(onChange: (items: any) => void) {
  const  mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const  collection = mongodb.db('test').collection('Cart');

  console.log('subscribed to cart');
  for  await (const  change  of  collection.watch()) {
    onChange(change);
  }
}
