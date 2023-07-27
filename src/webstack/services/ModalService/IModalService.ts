export interface IModalResult<TComponent, TResult> {
  modal: IModalRef<TComponent, TResult>;
  data: TResult | undefined;
}

export interface IModalRef<TComponent, TResult> {
  element: React.FunctionComponentElement<any>;
  // onClose(): void;
  pop(): void;
  getResult(): Promise<TResult | undefined>;
  getModalResult(): Promise<IModalResult<TComponent, TResult | undefined>>;
  returnResult(data: TResult): void;
  close(): void;
}

export interface IModalService {
  openModal<TComponent extends ({}: PropsWithModal<TProps>) => JSX.Element, TProps, TResult>(type: TComponent, props: TProps): IModalRef<TComponent, TResult>;
}

export type PropsWithModal<P> = P & { modal?: IModalRef<{},{}> };