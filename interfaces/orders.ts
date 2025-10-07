export interface Order {
  _id: string;
  customerId: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  products: {
    _id: string;
    imgUrl: string;
    name: string;
    price: number;
    about: string;
    quantity: number;
    totalAmount: number;
  }[];
}
