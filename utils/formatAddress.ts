import { Address } from "@/interfaces/user";

// Function to format Addresses
export const formatAddress = (address: Address) => {
  // Create an array of address parts
  const parts = [
    address.landmark,
    address.streetAddressHouseNo,
    !address.streetAddressHouseNo && address.streetAddress2,
    address.cityTown,
    address.state,
    address.pinCode,
  ];

  // Filter out empty or undefined values and join with comma
  return parts.filter((part) => part && part.trim() !== "").join(", ");
};
