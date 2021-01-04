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
  userInSignForm: FormGroup; /* changer tout les userInSignForm en  signInForm */
  /*id = 2; */

  constructor( private formBuilder: FormBuilder, private userService: UserService ) {

    super();
/* déclarer le formgroup dans le constructeur  */
    this.userInSignForm = this.formBuilder.group({
      /*address: this.formBuilder.group({ 
        address1: ['', Validators.required],
        codepostal: ['', Validators.required],
        ville: ['', Validators.required],
      }),*/
      /* nomé les champs comme da ns la bd*/ 
      email: [''],
      name: [''],
      firstname: [''],
      phone: [''],

     });
  }
 /* dans le ngoninit ce que je veux que la page puisse faire une fois chargé.*/
  ngOnInit(){
  this.userService.getUsers()
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe(users => {
    console.log(users);
  });
   /* this.initUserForm(); /* pour initialiser le formulair en meme temps que le conposant. */
  }
    /* déclarer un variable "body", mettre les paramettre de la bd. ligne 58 appel API en  paramettre, dans ".pipe" pour manipuler les l'observable, "(takeUntil(this.ngUnsubscribe))" pour arreter d'écouter les observable.*/
    onSubmit() {
     const body = {
       name: this.userInSignForm.value.name,
       fistname: this.userInSignForm.value.firstname,
       email: this.userInSignForm.value.email,
       phone: this.userInSignForm.value.phone,
       isLunchLady: true,
    };

     console.log(this.userInSignForm.value);
     console.log(body);
     this.userService.putUser(body)
     .pipe(takeUntil(this.ngUnsubscribe))
     .subscribe();

    }
     
    /*Méthod - pour initialiser le formulair
    initUserForm(){
     this.userInSignForm = this.formBuilder.group({
      address: this.formBuilder.group({ 
        address1: ['', Validators.required],
        codepostal: ['', Validators.required],
        ville: ['', Validators.required],
      }),
      email: ['', Validators.email],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phone: ['', Validators.call],

     });
    }
    */

    onSubmitUserInSignForm(){
      console.log(this.userInSignForm.value);
      /*this.userService.putUser(this.)*/
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
