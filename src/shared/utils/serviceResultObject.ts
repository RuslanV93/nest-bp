import {
  DomainStatusCode,
  Extensions,
  ResultObject,
} from '../types/serviceResultObjectType';

export class ServiceResultObjectFactory {
  static successResultObject<T>(data: T | null = null): ResultObject<T | null> {
    return {
      status: DomainStatusCode.Success,
      data: data,
      extensions: [],
    };
  }
  static errorResultObject(
    status: keyof typeof DomainStatusCode,
    extensions: Extensions,
  ) {
    return {
      status: DomainStatusCode[status],
      data: null,
      extensions: [extensions],
    };
  }
  static internalErrorResultObject(): ResultObject<null> {
    return {
      status: DomainStatusCode.InternalServerError,
      data: null,
      extensions: [{ message: 'Internal Server Error' }],
    };
  }
  static unauthorizedResultObject(extensions: Extensions) {
    return {
      status: DomainStatusCode.Unauthorized,
      data: null,
      extensions: [extensions],
    };
  }
  static notFoundResultObject(extensions: Extensions) {
    return {
      status: DomainStatusCode.NotFound,
      data: null,
      extensions: extensions.message,
    };
  }
  static badRequestResultObject(extensions: Extensions) {
    return {
      status: DomainStatusCode.BadRequest,
      data: null,
      extensions: [extensions],
    };
  }
}
