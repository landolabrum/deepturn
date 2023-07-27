import React from "react";
import { IModalService } from "@webstack/services";
import { IModalRef } from "@webstack/services/ModalService/IModalService";
import styles from './ModalContainer.scss'
import { getService } from "@webstack/common";

interface IState {
  currentModal: any,
}

interface IProps {

}

export default class ModalContainer extends React.Component<IProps, IState> {

  private currentModal: any;
  private hasModal = false;

  constructor(props: IProps) {
    super(props);
    const modalService = getService<IModalService>('IModalService');
    (modalService as any)._setModalContainer(this); 
    this.state = { currentModal: undefined };
  }

  public addModal(modal: IModalRef<{}, {}>) {
    this.currentModal = modal.element;
    this.setBodyScroll();
    this.setState({ currentModal: modal.element });
  }

  public removeModal(modal: IModalRef<{}, {}>) {
    this.currentModal = undefined;
    this.setBodyScroll();
    this.setState({ currentModal: undefined });
  }

  private setBodyScroll() {

    if (this.currentModal) {
      var width = document.body.offsetWidth;
      document.body.classList.add('no-scroll');
      if (!this.hasModal) {
        var scrollbarWidth = document.body.offsetWidth - width;
        document.body.style.marginRight = scrollbarWidth + 'px';
      }
      this.hasModal = true;
    } else {
      document.body.classList.remove('no-scroll');
      document.body.style.marginRight = '0';
      this.hasModal = false;
    }
  }

  render() {

    return (
      <>
        <style jsx>{ styles }</style>
        { (this.state.currentModal != null) &&
          <>
            <div className="modal-bg"></div>
            <div className="modal-area">
              <div className="modal-scroll">
                { this.state.currentModal }
              </div>
            </div>
          </>
        }
      </>
    );

  }

}