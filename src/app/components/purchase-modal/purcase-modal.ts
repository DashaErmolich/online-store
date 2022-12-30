import { appDrawer } from '../drawer/drawer';
export class PurchaseModal {
  getPurchaseModalContent(): HTMLElement {
    const form = document.createElement('form');
    const formName = appDrawer.getPurchaseModalFormGroupPersonName();
    const formTel = appDrawer.getPurchaseModalFormGroupPersonTel();
    const formAddress = appDrawer.getPurchaseModalFormGroupPersonAddress();
    const formEmail = appDrawer.getPurchaseModalFormGroupPersonEmail();
    form.append(formName, formTel, formAddress, formEmail);
    return form;
  }
}