import {Component, Input, OnInit} from '@angular/core';
import { Hero } from '../data/hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../service/hero.service';
import {WeaponService} from "../service/weapon.service";
import {subscriptionLogsToBeFn} from "rxjs/internal/testing/TestScheduler";
import {first, Subscription} from "rxjs";
import {Weapon} from "../data/weapon";
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    hero: Hero | undefined;
    subscriptionGetWeapons?: Subscription;
    weapons: Weapon[] = [];
    selectedWeapon: Weapon | undefined; // Variable pour stocker la valeur sélectionnée

    constructor(
        private route: ActivatedRoute,
        private heroService: HeroService,
        private weaponService: WeaponService,
        private location: Location
    ) {
    }
    attaque: number = 1;
    esquive: number = 1;
    degats: number = 1;
    pv: number = 10;
    subGetHero: any;
    id: string = '0';
    weapon? : Weapon  ;

    ngOnInit(): void {
        this.getHero();
        this.id = String(this.route.snapshot.paramMap.get('id'));
        this.getWeapons();

    }

    getHero(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.subGetHero = this.heroService.getHero(id).pipe(first()) //recupere que la premiere valeur envoyer à l'observable
            .subscribe(hero => {
            this.hero = hero
            console.log(hero)
            this.attaque = this.hero?.attaque || 10;
            this.esquive = this.hero?.esquive || 10;
            this.degats = this.hero?.degats || 10;
            this.pv = this.hero?.PV || 10;
            if(this.hero.weapon) {
              this.subGetHero = this.weaponService.getWeapon(this.hero.weapon).pipe(first()) //recupere que la premiere valeur envoyer à l'observable
                .subscribe(weaponforhero => {
                  this.weapon = weaponforhero || undefined;
                });
            }
            console.log(this.weapon);
        });
    }
  getWeapons(): void {
    this.subscriptionGetWeapons =
      this.weaponService.getWeapons().subscribe(weapons => this.weapons = weapons);
  }

    getPointDeCompetence(): number {
        let allPointUse = -1;

        if (this.hero) {
            allPointUse = this.attaque + this.pv + this.esquive + this.degats;

        }
        return 40 - allPointUse;
    }
  onChange(event : Event) {
    // Logique pour ajouter une arme ici
    const eventObject = event.target as HTMLSelectElement ;

    console.log(`Arme sélectionnée : ${eventObject}`);

    this.subGetHero = this.weaponService.getWeapon(eventObject.value).pipe(first()) //recupere que la premiere valeur envoyer à l'observable
      .subscribe(weapon => {
        this.selectedWeapon = weapon;
      });    // Vous pouvez ajouter ici la logique pour effectuer des actions spécifiques avec l'arme sélectionnée


  }

  canBeEquipedWeapon() {
    if (this.selectedWeapon) {
      const possible =
        (this.attaque + this.selectedWeapon.attaque >= 1 &&
        this.esquive + this.selectedWeapon.esquive >= 1 &&
        this.pv + this.selectedWeapon.PV >= 1 &&
        this.degats + this.selectedWeapon.degats >= 1);
      return possible ;
    }else{ return false}
  }
  equipedWeapon() {
    console.log(`Arme équipée : ${this.selectedWeapon}`);
    if (this.selectedWeapon) {
      if (this.canBeEquipedWeapon() ){

        this.weapon = this.selectedWeapon ;
      }
    }
  }
    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }

    checkStatIsNotOk(): boolean {
        if (this.getPointDeCompetence() < 0) {

            return true ;
        } else {
          if(this.weapon) {
            const possible =
              (this.attaque + this.weapon.attaque >= 1 && this.esquive + this.weapon.esquive >= 1 && this.pv + this.weapon.PV >= 1 && this.degats + this.weapon.degats >= 1);
            return !possible;

          }else {
            return false;
          }
        }
    }

    save(): void {
        // Récupérez les valeurs du formulaire
        const attaqueValue = this.attaque ;
        const esquiveValue = this.esquive ;
        const degatsValue = this.degats ;
        const pvValue = this.pv ;
        const weaponEquiped =  this.weapon ;

      // Mettez à jour les propriétés du héros avec les nouvelles valeurs
        if (this.hero) {
            this.hero.attaque = attaqueValue;
            this.hero.esquive = esquiveValue;
            this.hero.degats = degatsValue;
            this.hero.PV = pvValue;
            if (weaponEquiped) {
              this.hero.weapon = weaponEquiped.id;
              weaponEquiped.owner = this.hero.id ;
              console.log(weaponEquiped);
              this.weaponService.updateWeapon(weaponEquiped).then(updateWeapon => {
                console.log('arme mis à jour :', updateWeapon);
              })
            }
            let promise = this.heroService.updateHero(this.hero);

        }
    }

    goBack(): void {
        this.location.back();
        this.subGetHero.unsubscribe()
        console.log(this.subGetHero)
    }

    delete(): void {
        this.heroService.deleteHero(this.id)
            .then(h => {
                console.log( this.id , 'à été suprimé');
                this.goBack();
            })
    }
  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy weapons component");
    this.subscriptionGetWeapons?.unsubscribe();
    this.subGetHero.unsubscribe()
  }
}
