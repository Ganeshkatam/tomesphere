export type Result<T> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          error: {
              message: string;
              code?: string;
          };
      };

export type ServerActionResult<T> = Result<T>;
