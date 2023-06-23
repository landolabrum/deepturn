import { Subject, Subscription } from "rxjs";

export class EventEmitter<T> extends Subject<T> {
  // new (): EventEmitter<T>
  private subject = new Subject<T>();

  emit(value: T): void {
    this.subject.next(value);
  }

  subscribe(generatorOrNext?: any): Subscription {
    return this.subject.subscribe(generatorOrNext);
  }
}