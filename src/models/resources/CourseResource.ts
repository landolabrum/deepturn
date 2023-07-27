import LessonResource from "./LessonResource";
import Resource from "./Resource";

export default interface CourseResource extends Resource {
  thumbnail: string | undefined;
  resourceType: "Course";
  id: string;
  name: string;
  description?: string;
  courseNumber?: string;
  lessons?: LessonResource[];
  available?: boolean;
  status: 'active' | 'preview' | 'discontinued' | 'hidden';
}
