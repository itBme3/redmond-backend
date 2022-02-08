export type DbQueryMethod = 'orderBy' | 'startAt' | 'startAfter' | 'startBefore' | 'limit' | 'where' | string;
export const DbQueryMethods:DbQueryMethod[] = ['orderBy', 'startAt', 'startAfter', 'startBefore', 'limit', 'where']

export type DbQueryOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in' | string;

export const DbQueryOperators: DbQueryOperator[] = ['==', '!=', '>', '<', '>=', '<=', 'array-contains', 'array-contains-any', 'in', 'not-in']

export interface DbQueryObject  {
  orderBy?: string;/* props separated by commas ex: { orderBy: 'createdAt,desc', where: 'this,==,that' }'*/
  where?: [string, DbQueryOperator, any][];
  limit?: number;
  startAt?: any;
  startAfter?: any;
  startBefore?: any;
  [key: string]: any
}