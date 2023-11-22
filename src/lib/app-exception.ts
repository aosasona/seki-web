export class AppException extends Error {
  constructor(
    public message: string,
    public status?: number,
    public errors?: Record<string, any> = {}
  ) {
    super(message);
  }
}
