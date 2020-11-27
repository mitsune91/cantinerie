import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../services/menu.service';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/core/base.component';
import {Menu} from '../../models/Menu';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  weeklyMenus: any = [];
  selectedMenusFromDay: any[];
  date = new Date();
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  selectedDay = 'Vendredi';

  constructor(private menuService: MenuService,
              private user: UserService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.selectedDay);
    this.getWeekMenus();
    this.initMenusOfTheDay();
  }

  // TODO A travailler !! Ne fonctionne pas encore
  initMenusOfTheDay(): void {
    if (this.weeklyMenus) {
      let today: string;
      const day = new Date().getDay().toString();
      switch (today) {
        case '1' :
          today = 'Lundi';
          break;
        case '2' :
          today = 'Mardi';
          break;
        case '3' :
          today = 'Mercredi';
          break;
        case '4' :
          today = 'Jeudi';
          break;
        case '5' :
          today = 'Vendredi';
          break;
      }
      this.selectedMenusFromDay = this.weeklyMenus.filter(w => w.day === today);
    }
  }

  loadMenuOfSelectedDay(day: string): void {
    this.selectedDay = day;
    console.log(this.selectedDay);
    this.selectedMenusFromDay = this.weeklyMenus.filter(w => w.day === day);
    console.log(this.selectedMenusFromDay);
  }

  // Méthode pour récupérer les menus de la semaines en cours
  getWeekMenus(): void {

    const rawMenus = [];
    const weekNumber = this.getWeekNumber(this.date);

    this.menuService.getMenus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        data.forEach(d => {
          if (d.availableForWeeks.includes(weekNumber)) {
            rawMenus.push(d);
          }
        });
        this.dispatchMenus(rawMenus);
      });
  }

  // Méthode pour répartir aléatoirement les menus disponibles de la semaine sur chaque jour
  dispatchMenus(menus: Menu[]): void {
    console.log(menus);

    // Pour chaque jour de la semaine
    this.days.forEach(day => {
      const dailyMenu = {
        day: undefined,
        menus: undefined
      };
      dailyMenu.day = day;
      dailyMenu.menus = menus.splice(0, 2); // A voir le slice qui ne fonctionne pas
      // console.log(dailyMenu.menus);
      this.weeklyMenus.push(dailyMenu);
    });
    console.log(this.weeklyMenus);
  }

  // Méthode pour récupérer le numéro de la semaine en cours
  getWeekNumber(date: any): any {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - Number(yearStart)) / 86400000) + 1) / 7);
    return weekNo;
  }

}
