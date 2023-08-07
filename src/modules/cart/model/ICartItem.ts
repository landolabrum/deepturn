

export interface ICartItem {
    images: string[],
    name: string,
    description: string,
    price: string,
    price_object: { id: string, qty: number }
}