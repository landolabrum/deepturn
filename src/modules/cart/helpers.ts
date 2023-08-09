import CookieHelper from "@webstack/helpers/CookieHelper";

const updateTotalQty = () => {
    const cart = CookieHelper.getCookie("cart");
    const cart_object = typeof (cart) === 'string' && JSON.parse(cart);
    const newTotalQty = cart_object?.items
      ? cart_object.items.reduce((sum: number, item: any) => sum + (item.price_object.qty || 0), 0)
      : 0;
    return newTotalQty;
  };