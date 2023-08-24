# Order Picking System
## Models:
```typescript
  enum OrderStatus {
  PENDING,
  PICKING,
  READY_FOR_DELIVERY
}
 interface Order {
  id:                string
  customerName:      string
  createdAt:         DateTime
  updatedAt:         DateTime
  status:            OrderStatus
  itemsDetails:      ItemDetails[]
  assigned_picker?:  Picker
  cart?:             Cart
  cart_id?:          string
}

 enum CartStatus {
  MISSING_ITEMS,
  COMPLETE
}
 interface Cart {
  id:             string
  itemsDetails:   ItemDetails[]
  order?:         Order
  status?:        CartStatus
}

 enum ItemStatus {
  IN_STOCK,
  OUT_OF_STOCK,
  PREPARING
}
 interface Item {
  id:       string
  name:     string
  price:    Number
  quantity: Number
  status:   ItemStatus
}
interface ItemDetails {
  itemId    String
  name      String
  quantity  Int
}

 enum PickerLevel {
  FIRST_LINE,
  SECOND_LINE
}
 interface Picker {
  id:                String
  level:             PickerLevel
  assigned_orders:   Order[]
}
```

## Installation
From the root folder run:
```bash
npm i
prisma generate
npx lerna run dev
```
## Usage
From your browser, go to `http://127.0.0.1:3000/`
