import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {BaseComponent} from '../../shared/core/base.component';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent implements OnInit {

  user: User;
  userInSignForm: FormGroup;
  /*id = 2; */

  constructor(private userService: UserService, private formBuilder: FormBuilder ) {

    super();
  }

  /* id: number;
  address: string;
  wallet: number;
  postalCode: string;
  registrationDate: string;
  email: string;
  isLunchLady: boolean;
  name: string;
  firstname: string;
  phone: string;
  town: string;
  sex: number; // The sex of the user. 0 for man, 1 for woman, 2 for other
  status: number; // The status for the user. 0 for Enabled, 1 for Disabled, 2 for Deleted
  imageId?: Array<number>; // Nullable */

  

  ngOnInit(): void {

    this.userInSignForm = this.formBuilder.group({
      address: this.formBuilder.group({ 
        address1: [''],
        codepostal: [''],
        ville: [''],
      }),
      email: [''],
      nom: [''],
      prenom: [''],
      phone: [''],


      
    });
  }
    
    onSubmit() {

     console.log(this.userInSignForm.value);
    }


   /*
     // Appel au service MenuService
     this.userService.getUser(this.id)
     // Tant que la page n'est pas détruite,
     .pipe(takeUntil(this.ngUnsubscribe))
     // on souscrit à l'observable ou à la méthode getMenu()
     .subscribe(data => {
       // on stocke les données dans une variable pour les réutiliser
       this.user = data;
       console.log(this.user);
   });*/

}
