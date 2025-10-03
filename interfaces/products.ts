
export interface category {
    _id: string,
    name: string,
    products: string[]
}

// Product interface defines the structure of product objects
export interface product {
    _id: string,
    category: category;
    productTypes: string[];
    benefits: string[];
    descriptionImg: {
        url: string,
        public_id: string,
    };
    productImg: {
        url: string,
        public_id: string,
    };
    thirdImg: {
        url: string,
        public_id: string,
    };
    fourthImg: {
        url: string,
        public_id: string,
    };
    name: string;
    about: string;
    price: number;
    description: string;
    discount: number;
    stock: number;
    expiryMonths: number,
    form: string,
    packSize: string,
    appliedFor: string,
    suitableFor: string,
    safetyNote: string
}

// Initial product state for loading
export const initialProduct = {
    _id: "",
    category: {
        _id: "",
        name: "",
        products: []
    },
    productTypes: [],
    benefits: [],
    descriptionImg: {
        url: "",
        public_id: "",
    },
    productImg: {
        url: "",
        public_id: "",
    },
    thirdImg: {
        url: "",
        public_id: "",
    },
    fourthImg: {
        url: "",
        public_id: "",
    },
    name: "",
    about: "",
    price: 0,
    description: "",
    discount: 0,
    stock: 0,
    expiryMonths: 0,
    form: "",
    packSize: "",
    appliedFor: "",
    suitableFor: "",
    safetyNote: ""
}