import { initialProduct, product } from "./products";

export interface productType {
  _id: string;
  category: string;
  productTypes: string[];
  benefits: string[];
  name: string;
  img: string;
  price: number;
  quantity: number;
  about: string;
  discount: number;
  loading: boolean;
}

export const convertWishlistToProduct = (item: productType): product => ({
  ...initialProduct,
  _id: item._id,
  name: item.name,
  about: item.about,
  price: item.price,
  discount: item.discount,
  benefits: item.benefits,
  productTypes: item.productTypes,
  category: { _id: "", name: item.category, products: [] },
  productImg: { url: item.img, public_id: "" },
});
