import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Weapon} from "../data/weapon";
import {first} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {WeaponService} from "../service/weapon.service";
import {Location} from "@angular/common";
import {Hero} from "../data/hero";
import {HeroService} from "../service/hero.service";
import {checkStatsIsOKValidator, forbiddenNameValidator} from "./reactive_form_validator";

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.css']
})
export class WeaponDetailComponent implements OnInit{
  weaponForm: FormGroup; // Déclaration du reactive form
    weapon: Weapon | undefined;
    id: string = '0';
    subGetweapon: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private weaponService: WeaponService,
              private heroService: HeroService,
              private location: Location
  ) {

    this.weaponForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, forbiddenNameValidator(/flammenwerfer/i)]),
      attaque: new FormControl(0,[
        Validators.required, Validators.min(-5), Validators.max(5) ]),
      esquive: new FormControl(0,[
        Validators.required, Validators.min(-5), Validators.max(5) ]),
      degats: new FormControl(0,[
        Validators.required, Validators.min(-5), Validators.max(5) ]),
      pv: new FormControl(0,[
        Validators.required, Validators.min(-5), Validators.max(5) ]),
      owner: new FormControl(''),
    },
    {
      validators: checkStatsIsOKValidator()
    });
  }


  ngOnInit(): void {
    this.getWeapon();
    this.id = String(this.route.snapshot.paramMap.get('id'));

  }
  getWeapon(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.subGetweapon = this.weaponService.getWeapon(id).pipe(first())
      .subscribe(weapon => {
        this.weapon = weapon;
        console.log(weapon);
        console.log(weapon);
        console.log(weapon);

        // Récupération du héros via l'ID
        if (this.weapon?.owner) {
          this.heroService.getHero(this.weapon.owner).pipe(first())
            .subscribe(
              hero => {
                console.log('Héros récupéré avec succès :', hero);

                // Mettez à jour le formulaire avec les données récupérées
                this.weaponForm.patchValue({
                  name: weapon.name,
                  attaque: weapon.attaque || 0,
                  esquive: weapon.esquive || 0,
                  degats: weapon.degats || 0,
                  pv: weapon.PV || 0,
                  owner: hero
                });
              });
        } else {
          // Si l'arme n'a pas de propriétaire, mettez à jour le formulaire sans l'information du propriétaire
          this.weaponForm.patchValue({
            name: weapon.name,
            attaque: weapon.attaque || 0,
            esquive: weapon.esquive || 0,
            degats: weapon.degats || 0,
            pv: weapon.PV || 0,
            owner: '' // valeur par défaut
          });
        }
      });
  }

  getNameHero() : string{
    return this.weaponForm.value.owner.name ;
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

    goBack(): void {
        this.location.back();
        this.subGetweapon.unsubscribe()
        console.log(this.subGetweapon)
    }
  save() {
    if (this.weaponForm.valid) {
      if (this.weapon) {
        this.weapon.name = this.weaponForm.value.name;
        this.weapon.attaque = this.weaponForm.value.attaque;
        this.weapon.esquive = this.weaponForm.value.esquive;
        this.weapon.degats = this.weaponForm.value.degats;
        this.weapon.PV = this.weaponForm.value.pv;
      // Accédez aux valeurs du reactif form
      const formData = this.weaponForm.value;
        console.log(this.weapon);

        let promise = this.weaponService.updateWeapon(this.weapon);}

      // Ajoutez la logique de sauvegarde ici
    }}
    delete(): void {
       if(this.weapon?.owner){
         this.updateOwner();
       }
        this.weaponService.deleteWeapon(this.id)
            .then(w => {
                console.log( this.id , 'à été suprimé');
                this.goBack();
            })
    }

  updateOwner(): void {
    // et une méthode updateHero pour mettre à jour un héros
    if(this.weapon?.owner) {
      this.subGetweapon = this.heroService.getHero(this.weapon!.owner).pipe(first()) //recupere que la premiere valeur envoyer à l'observable
        .subscribe(hero => {

      hero.weapon = undefined; // Supprimez la référence de l'arme chez le propriétaire
          this.heroService.updateHero(hero).then(updatedHero => {
          console.log('Propriétaire mis à jour :', updatedHero);
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour du propriétaire :', error);
        });
        });
    }
  }


  ngOnDestroy(): void {
    // Utilisation du cycle de vie du composant pour unsubscribe
    this.subGetweapon?.unsubscribe();
  }
}
