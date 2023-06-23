import CourseResource from "./CourseResource";
import Resource from "./Resource";

export default interface SeriesResource extends Resource {
  resourceType: 'Series';
  id: string;
  name: string;
  courses?: CourseResource[];
  status: 'active' | 'hidden';
  color: string;
}

