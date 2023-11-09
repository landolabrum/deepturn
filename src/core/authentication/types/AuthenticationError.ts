export enum AuthenticationErrorCode {
  Fail = 'fail',
  BadEmail = 'bad-email',
  WeakPassword = 'weak-password',
  Other = 'other',
  InvalidToken = 'invalid-token',
  EmailInUse = 'invalid-token',
}

export class AuthenticationError extends Error {
  readonly name = 'AuthenticationError';
  constructor(message: string, public code: AuthenticationErrorCode) {
    super(message);
  }
}
