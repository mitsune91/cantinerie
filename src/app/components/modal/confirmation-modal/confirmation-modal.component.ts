import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() twoButton: boolean;
  @Input() modalTitle: string;
  @Input() message: string;
  @Output() isModalOpen = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  isAccepted(response: boolean): void {
    this.isModalOpen.emit(response);
  }

}
