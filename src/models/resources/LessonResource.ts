import Resource from "./Resource";

export default interface LessonResource extends Resource {
  resourceType: 'Lesson';
  id: string;
  name: string;
}




