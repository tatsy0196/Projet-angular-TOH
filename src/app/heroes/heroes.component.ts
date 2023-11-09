import { Component, OnInit } from '@angular/core';
import { Hero } from '../data/hero';
import { HeroService } from '../service/hero.service';
import { MessageService } from '../service/message.service';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']

})
export class HeroesComponent implements OnInit {

  selectedHero?: Hero;
  subscriptionGetHeroes?: Subscription;

  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    private router: Router) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.subscriptionGetHeroes =
        this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  createHero(): void {
    this.heroService.addHero()
      .then(h => {
        this.router.navigate(['heroDetail/' + h.id]);
      })

  }
  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy heroes component");
    this.subscriptionGetHeroes?.unsubscribe();
  }

}


