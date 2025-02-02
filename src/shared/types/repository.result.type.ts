export type RepositoryResultType<T> = {
  success: boolean;
  data: T | null;
  error?: {
    message: string;
    code?: string;
  };
};
