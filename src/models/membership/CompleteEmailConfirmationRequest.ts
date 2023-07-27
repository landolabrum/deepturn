export default interface CompleteEmailConfirmationRequest {
  pendingConfirmationId: string;
  confirmationCode: string;
}