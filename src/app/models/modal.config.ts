export interface ModalConfig {
  modalTitle: string // Title
  modalDescription: string //  Body
  dismissButtonLabel?: string
  closeButtonLabel?: string
  shouldClose?(): Promise<boolean> | boolean // a ne pas utilisé sauf s'il faut rajouter des confirmation
  shouldDismiss?(): Promise<boolean> | boolean // a ne pas utilisé sauf s'il faut rajouter des confirmation
  onClose?(): Promise<boolean> | boolean // mettre la fonction a true pour rajouté des action an cliquant sur Close
  onDismiss?(): Promise<boolean> | boolean // mettre la fonction a true pour rajouté des action an cliquant sur Dismiss
  disableCloseButton?(): boolean // mettre la fonction a true pour désactivé le bouton Close
  disableDismissButton?(): boolean // mettre la fonction a true pour désactivé le bouton Dismiss
  hideCloseButton?(): boolean // mettre la fonction a true pour un display none Close
  hideDismissButton?(): boolean // mettre la fonction a true pour un display none Dismiss
}
