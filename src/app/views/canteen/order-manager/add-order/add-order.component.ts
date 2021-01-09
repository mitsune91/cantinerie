import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../../../shared/core/base.component';
import {UserService} from '../../../../services/user.service';
import {MealService} from '../../../../services/meal.service';
import {OrderService} from '../../../../services/order.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  users: any = [];
  filteredUsers: any = [];
  meals: any = [];
  filteredMeals: any = [];
  weekNumber: number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private mealService: MealService,
    private orderService: OrderService
  ) {
    super();

    this.form = this.fb.group({
      user: ['', Validators.required],
      meal: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.weekNumber = this.getWeekNumber(new Date());
    this.getAllUsers();
    this.getAvailableMeals(this.weekNumber);
  }

  // Récupère tous les utilisateurs
  getAllUsers(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(users => {
        this.users = users;
      });
  }

  // Récupère tous les menus
  getAvailableMeals(weekNumber: number): void {
    this.mealService.getMealOfTheWeek(weekNumber)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(meals => {
        this.meals = meals;
      });
  }

  // Récupère des users en fonction des lettres tapées dans le filtre
  getFilterUsersData(users: any, ev: any): void {
    this.filteredUsers = users.filter(u => u.firstname.toLowerCase().includes(ev.key) || u.name.toLowerCase().includes(ev.key));
  }

  // Récupère des plats en fonction des lettres tapées dans le filtre
  getFilterMealsData(meals: any, ev: any): void {
    this.filteredMeals = meals.filter(m => m.label.toLowerCase().includes(ev.key));
  }

  // Permet de revenir à la page de gestion des plats
  onNavigateBack(): void {
    this.router.navigate(['canteen/meals']);
  }

  // Envoie le formulaire
  submitAddedOrder(): void {
    const selectedUser = this.getUserByName(this.form.value.user);
    const selectedMeal = this.getMealByLabel(this.form.value.meal);
    const body = {
      userId: selectedUser.id,
      constraintId: -1,
      quantity: [
        {
          quantity: this.form.value.quantity,
          mealId: selectedMeal.id,
        }
      ]
    };
    if (selectedUser.wallet > this.simulatePriceDF(this.form.value.meal, this.form.value.quantity)) {
      this.orderService.addOrder(body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    } else {
      alert('Le client n\'a pas assez de crédit pour commander');
    }
  }

  // Récupère user par son nom et prénom
  getUserByName(fullName: string): any {
    const firstname = fullName.slice(0, fullName.indexOf(' '));
    const name = fullName.slice(fullName.indexOf(' ') + 1, fullName.length);
    const user = this.users.filter(u => u.firstname === firstname && u.name === name);
    return user[0];
  }

  // Récupère le portefeuille d'un utilisateur
  getUserWallet(userFullname: string): number {
    if (userFullname) {
      const user = this.getUserByName(userFullname);
      return user?.wallet;
    }
  }

  // Récupère un plat par son label
  getMealByLabel(label: string): any {
    const meal = this.meals.filter(m => m.label === label);
    return meal[0];
  }

  // Calcule une commande en fonction du plat et de la quantité choisie
  simulatePriceDF(mealLabel: string, quantity: number): any {
    if (mealLabel && quantity) {
      const meal = this.getMealByLabel(mealLabel);
      return (meal.priceDF * quantity).toFixed(2);
    }
  }

  // Méthode pour récupérer le numéro de la semaine en cours
  getWeekNumber(date: any): any {
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil(((date - Number(yearStart)) / 86400000 + 1) / 7);
    if (weekNo > 52) {
      weekNo = weekNo - 52;
    }
    return weekNo;
  }

  // TODO Ajouter modal de confirmation de prise de commande
  // TODO Retravailler un peu le formulaire

}
