import { Component, OnInit } from '@angular/core';
import { Hero } from '../data/hero';
import { HeroService } from '../service/hero.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  subscriptionGetHeroes?: Subscription;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.subscriptionGetHeroes = this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }

  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy heroes component");
    this.subscriptionGetHeroes?.unsubscribe();
  }
}
