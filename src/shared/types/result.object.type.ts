export enum DomainStatusCode {
  Success = 0,
  NotFound = 1,
  Forbidden = 2,
  Unauthorized = 3,
  BadRequest = 4,
  InternalServerError = 5,
}

export type Extensions = {
  message: string;
  field?: string;
};
export type ResultObject<Data> = {
  status: DomainStatusCode;
  data: Data;
  extensions: Extensions[];
};
