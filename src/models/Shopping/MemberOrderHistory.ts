export type OrderHistoryItem = {
  partnerName: string;
  productName: string;
  productQuantity: number;
  price: number;
};

interface OrderHistoryProps {
  orderStatus: string;
  orderItems: OrderHistoryItem[] | [];
  orderTotal: string;
  orderId: string;
  orderDate: string;
}
export interface OrderHistoryResponse extends OrderHistoryProps {
  transactionCurrency: string;
  transactionFee: string;
  fromWalletAddress: string;
  toWalletAddress: string;
  paymentWallet: string;
  paymentStatus: string;
  transactionhash: string;
  memberId: string;
}
export interface OrderHistoryDetailsResponse extends OrderHistoryProps {
  gasTotal: string;
  paymentCurrency: string;
  paymentWallet: string;
  transactionHash: string;
}
