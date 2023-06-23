import { ConfirmationMethodId, ConfirmationTypeId } from "./types";

export default interface SendEmailConfirmationResponse {
  pendingConfirmationId: string;
  confirmationType: ConfirmationTypeId;
  confirmationMethod: ConfirmationMethodId;
}