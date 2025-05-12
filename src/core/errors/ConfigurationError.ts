export class InternalError extends Error {
  readonly name = 'InternalError';
  constructor(message: string, public code?: string | undefined) {
    super(message);
  }
}
