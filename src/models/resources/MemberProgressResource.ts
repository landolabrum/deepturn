export default interface MemberProgressResource {
  courseId: string;
  lastLessonId: string | null;
  completed: boolean;
}
