export interface Product {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    images: string[];
    category: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    totalValue: number;
    description?: string; // La description est optionnelle (peut être undefined)
    __v: number;
}