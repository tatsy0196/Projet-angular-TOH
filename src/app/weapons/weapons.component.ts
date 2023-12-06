import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {Weapon} from "../data/weapon";
import {WeaponService} from "../service/weapon.service";

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css']
})
export class WeaponsComponent implements OnInit{

  selectedHero?: Weapon;
  subscriptionGetHeroes?: Subscription;
  FilterValue: number | undefined;

  weapons: Weapon[] = [];
filteredWeapons : Weapon[] = [];
  constructor(
      private weaponService: WeaponService,
      private router: Router) { }

  ngOnInit(): void {
    this.getWeapons();
  }

  getWeapons(): void {
    this.subscriptionGetHeroes =
      this.weaponService.getWeapons().subscribe(
    weapons => {
      this.weapons = weapons;
      this.filteredWeapons = [...this.weapons];
    });
  }

  createWeapon(): void {
    this.weaponService.addWeapon()
      .then(w => {
        this.router.navigate(['weaponDetail/' + w.id]);
      })

  }


  resetFilter(): void{
    this.filteredWeapons = this.weapons;
  }
  // Fonction pour filtrer les héros par type
  filterByAttaque(): void {
    if(this.FilterValue) {
      this.filteredWeapons = this.weapons.filter(weapon => weapon.attaque === this.FilterValue);
    }}
  filterByPV(): void {
    if(this.FilterValue) {
      this.filteredWeapons = this.weapons.filter(weapon => weapon.PV === this.FilterValue);
    }  }
  filterByDegats(): void {
    if(this.FilterValue) {
      this.filteredWeapons = this.weapons.filter(weapon => weapon.degats === this.FilterValue);
    }}
  filterByEsquive(): void {
    if(this.FilterValue) {
      this.filteredWeapons = this.weapons.filter(weapon => weapon.esquive === this.FilterValue);
    }  }
  // Fonction pour trier les héros par attribut
  sortHeroesByAttack(): void {
    console.log('Avant le tri par attaque :', this.filteredWeapons.map(weapon => weapon.attaque));
    this.filteredWeapons.sort((a, b) => (a.attaque > b.attaque) ? 1 : -1);
    console.log('Après le tri par attaque :', this.filteredWeapons.map(weapon => weapon.attaque));
  }

  sortHeroesByDegats(): void {
    this.filteredWeapons.sort((a, b) => (a.degats > b.degats) ? 1 : -1);
  }
  sortHeroesByPV(): void {
    this.filteredWeapons.sort((a, b) => (a.PV > b.PV) ? 1 : -1);
  }

  sortHeroesByEsquive(): void {
    this.filteredWeapons.sort((a, b) => (a.esquive > b.esquive) ? 1 : -1);
  }



  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy weapons component");
    this.subscriptionGetHeroes?.unsubscribe();
  }

}

