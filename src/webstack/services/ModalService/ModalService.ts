import ModalContainer from "@webstack/components/ModalContainer/ModalContainer";
import React from "react";
import { IModalRef, IModalResult, IModalService } from "./IModalService";

class ModalRef<TComponent, TResult> implements IModalRef<TComponent, TResult> {
  private modalResultPromise: Promise<IModalResult<TComponent, TResult | undefined>>;
  private modalResultFunction: (input: IModalResult<TComponent, TResult | undefined>) => void = (input: IModalResult<TComponent, TResult | undefined>) => { return; };

  public element!: React.FunctionComponentElement<any>;
  private modalService: ModalService;

  constructor(modalService: ModalService) {
    this.modalService = modalService;
    this.modalResultPromise = new Promise<IModalResult<TComponent, TResult | undefined>>((resolve, reject) => {
      this.modalResultFunction = resolve;
    });
  }

  public pop() {
    (this.modalService as any).popModal(this);
  }

  public getResult(): Promise<TResult | undefined> {
    return new Promise<TResult | undefined>((resolve, reject) => {
      this.modalResultPromise.then(result => {
        resolve(result.data);
      });
    });
  }

  public getModalResult(): Promise<IModalResult<TComponent, TResult | undefined>> {
    return this.modalResultPromise;
  }

  public returnResult(data: TResult) {
    this.modalResultFunction({ data, modal: this });
  }

  public close() {
    this.modalResultFunction({ data: undefined, modal: this });
  }


}

export default class ModalService implements IModalService {
  private modalCounter = 0;
  // private modalStack: ModalRef<{}, {}>[] = [];
  private modalStack: any[] = [];
  private modalContainer!: ModalContainer;

  public openModal<TComponent extends ({}: TProps) => JSX.Element, TProps, TResult>(type: TComponent, props: TProps): IModalRef<TComponent, TResult> {
    return this._createModal(type, props);
  }

  private _createModal<TComponent extends ({}: TProps) => JSX.Element, TProps, TResult>(type: TComponent, props: TProps): IModalRef<TComponent, TResult>  {
    this.modalCounter++;
    if (props == null) { props = {} as TProps; }
    (props as any).key = this.modalCounter;
    const modal = new ModalRef<TComponent, TResult>(this);
    (props as any).modal = modal;
    const el = React.createElement(type, props);
    modal.element = el;
    this.modalStack.push(modal);
    this.modalContainer.addModal(modal);
    return modal;
  }

  /* Private APIs (don't delete) */

  private _setModalContainer(container: ModalContainer) {
    this.modalContainer = container;
  }
  
  private popModal(modal: ModalRef<{}, {}>) {
    const last = this.modalStack[this.modalStack.length - 1];
    if (modal !== last) {
      throw new Error(`modal provided is not the top modal in the stack. modal.`);
    }
    this.modalContainer.removeModal(modal);
    this.modalStack.pop();
  }

}
