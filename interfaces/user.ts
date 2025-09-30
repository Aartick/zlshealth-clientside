export interface UserDetails {
  fullName: string;
  dob: string;
  phone: string;
  gender: string;
  email: string;
  img?: string | null;
}

export const initialDetails = {
  fullName: "",
  dob: "",
  phone: "",
  gender: "",
  email: "",
  img: "",
};

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  email?: string;
  landmark?: string;
  streetAddressHouseNo: string;
  streetAddress2?: string;
  addressType: string;
  cityTown: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export const initialAddress = {
  _id: "",
  fullName: "",
  phone: "",
  email: "",
  landmark: "",
  streetAddressHouseNo: "",
  streetAddress2: "",
  addressType: "",
  cityTown: "",
  state: "",
  pinCode: "",
  isDefault: false,
};

// States of India
export const statesOfIndia = [
  "", //default empty option
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
