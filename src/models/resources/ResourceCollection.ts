import Resource from "./Resource";

export default interface ResourceCollection<T> extends Resource {
  resourceType: 'Collection';
  items: T[];
  total: number;
  limit: number;
  skip: number;
}
