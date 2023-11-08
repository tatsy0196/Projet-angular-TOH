import {Component, Input, OnInit} from '@angular/core';
import { Hero } from '../data/hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../service/hero.service';
import { FormControl } from '@angular/forms';
import {subscriptionLogsToBeFn} from "rxjs/internal/testing/TestScheduler";
import {first} from "rxjs";
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    hero: Hero | undefined;

    constructor(
        private route: ActivatedRoute,
        private heroService: HeroService,
        private location: Location
    ) {
    }

    attaque: number = 1;
    esquive: number = 1;
    degats: number = 1;
    pv: number = 10;
    subGetHero: any;
    id: string = '0';

    ngOnInit(): void {
        this.getHero();
        this.id = String(this.route.snapshot.paramMap.get('id'));

    }

    getHero(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.subGetHero = this.heroService.getHero(id).pipe(first())
            .subscribe(hero => {
            this.hero = hero
            console.log(hero)
            console.log(this.hero?.attaque)
            this.attaque = this.hero?.attaque || 10;
            this.esquive = this.hero?.esquive || 10;
            this.degats = this.hero?.degats || 10;
            this.pv = this.hero?.PV || 10;
        });
    }

    getPointDeCompetence(): number {
        let allPointUse = -1;
        if (this.hero) {
            allPointUse = this.attaque + this.pv + this.esquive + this.degats;
        }
        return 40 - allPointUse;
    }

    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }

    checkStatIsNotOk(): boolean {
        if (this.getPointDeCompetence() < 0) {
            return true
        } else {
            return false
        }
    }

    save(): void {
        // Récupérez les valeurs du formulaire
        const attaqueValue = this.attaque
        const esquiveValue = this.esquive
        const degatsValue = this.degats
        const pvValue = this.pv

        // Mettez à jour les propriétés du héros avec les nouvelles valeurs
        if (this.hero) {
            this.hero.attaque = attaqueValue;
            this.hero.esquive = esquiveValue;
            this.hero.degats = degatsValue;
            this.hero.PV = pvValue;
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
}
