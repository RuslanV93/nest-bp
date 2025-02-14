import {
  DomainStatusCode,
  ResultObject,
} from '../types/serviceResultObjectType';

export function isSuccess(
  result: ResultObject<any>,
): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}
