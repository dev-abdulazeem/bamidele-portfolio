export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number | string;
        email: string;
        role?: string;
        [key: string]: any;
      };
    }
  }
}