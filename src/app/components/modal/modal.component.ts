import { promise } from 'protractor';
import { Component, Injectable, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core'
import { ModalConfig } from '../../models/modal.config'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@Injectable()
export class ModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
  private modalRef: NgbModalRef;
  private element: any;

  constructor(private modalService: NgbModal, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    document.body.appendChild(this.element);
    //console.log('click')

  }

  /**
   * Overture du modal
   * Dans le modal content :-
   *  1./ Récupere le model de model pour pouvoir inscrire dynamiquement des informations
   *  2./ J'ai laissé le [ng-content] dans le modal content pour ne pas créer de confilt et aussi pour pouvoir mettre en dure les instructions dans le html
   */
  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent)
      this.modalRef.result.then(resolve, resolve)
    })
  }

  /**
   * Fermeture et annulation des process
   */
  async close(): Promise<void> {
    if (this.modalConfig.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig.onClose === undefined || (await this.modalConfig.onClose())
      this.modalRef.close(result)
    }
  }

  /**
   * Fermetur du modal
   */
  async dismiss(): Promise<void> {
    if (this.modalConfig.shouldDismiss === undefined || (await this.modalConfig.shouldDismiss())) {
      const result = this.modalConfig.onDismiss === undefined || (await this.modalConfig.onDismiss())
      this.modalRef.dismiss(result)
    }
  }

}
