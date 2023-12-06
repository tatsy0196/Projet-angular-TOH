import { Component, OnInit } from '@angular/core';
import { Hero } from '../data/hero';
import { HeroService } from '../service/hero.service';
import { MessageService } from '../service/message.service';
import { Router } from '@angular/router';
import {firstValueFrom, Subscription} from "rxjs";
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']

})
export class HeroesComponent implements OnInit {

  selectedHero?: Hero;
  subscriptionGetHeroes?: Subscription;
  FilterValue: number | undefined;
  heroes: Hero[] = [];
  filteredHeroes: Hero[] = []; // Ajout de la liste filtrée
  constructor(
    private heroService: HeroService,
    private router: Router) { }

   ngOnInit(): void {
    this.getHeroes();
    this.filteredHeroes =this.heroes;
    console.log(this.heroes);
  }

  getHeroes(): void {
      this.subscriptionGetHeroes = this.heroService.getHeroes().subscribe(heroes => {
        this.heroes = heroes;
        this.filteredHeroes = [...this.heroes];
      });
  }

  createHero(): void {
    this.heroService.addHero()
      .then(h => {
        this.router.navigate(['heroDetail/' + h.id]);
      })

  }
  resetFilter(): void{
    this.filteredHeroes = this.heroes;
  }
  // Fonction pour filtrer les héros par type
  filterByAttaque(): void {
    if(this.FilterValue) {
      this.filteredHeroes = this.heroes.filter(hero => hero.attaque === this.FilterValue);
  }}
  filterByPV(): void {
    if(this.FilterValue) {
      this.filteredHeroes = this.heroes.filter(hero => hero.PV === this.FilterValue);
    }  }
  filterByDegats(): void {
    if(this.FilterValue) {
      this.filteredHeroes = this.heroes.filter(hero => hero.degats === this.FilterValue);
    }}
  filterByEsquive(): void {
    if(this.FilterValue) {
      this.filteredHeroes = this.heroes.filter(hero => hero.esquive === this.FilterValue);
    }  }
  // Fonction pour trier les héros par attribut
  sortHeroesByAttack(): void {
    console.log('Avant le tri par attaque :', this.filteredHeroes.map(hero => hero.attaque));
    this.filteredHeroes.sort((a, b) => (a.attaque > b.attaque) ? 1 : -1);
    console.log('Après le tri par attaque :', this.filteredHeroes.map(hero => hero.attaque));
  }

  sortHeroesByDegats(): void {
    this.filteredHeroes.sort((a, b) => (a.degats > b.degats) ? 1 : -1);
  }
  sortHeroesByPV(): void {
    this.filteredHeroes.sort((a, b) => (a.PV > b.PV) ? 1 : -1);
  }

  sortHeroesByEsquive(): void {
    this.filteredHeroes.sort((a, b) => (a.esquive > b.esquive) ? 1 : -1);
  }
  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy heroes component");
    this.subscriptionGetHeroes?.unsubscribe();
  }

}


