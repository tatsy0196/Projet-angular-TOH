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

  weapons: Weapon[] = [];

  constructor(
      private weaponService: WeaponService,
      private router: Router) { }

  ngOnInit(): void {
    this.getWeapons();
  }

  getWeapons(): void {
    this.subscriptionGetHeroes =
      this.weaponService.getWeapons().subscribe(weapons => this.weapons = weapons);
  }

  createWeapon(): void {
    this.weaponService.addWeapon()
      .then(w => {
        this.router.navigate(['weaponDetail/' + w.id]);
      })

  }
  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy heroes component");
    this.subscriptionGetHeroes?.unsubscribe();
  }

}

