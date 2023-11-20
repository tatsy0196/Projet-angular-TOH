import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Weapon} from "../data/weapon";
import {first} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {WeaponService} from "../service/weapon.service";
import {Location} from "@angular/common";
import {Hero} from "../data/hero";

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
              private location: Location) {

    this.weaponForm = this.formBuilder.group({
      name: ['', Validators.required],
      attaque: [1, [Validators.min(-5), Validators.max(5)]],
      esquive: [1, [Validators.min(-5), Validators.max(5)]],
      degats: [1, [Validators.min(-5), Validators.max(5)]],
      pv: [1, [Validators.min(-5), Validators.max(5)]]
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
          this.weapon = weapon
          console.log(weapon)
            this.weaponForm.patchValue({
                name: weapon.name,
                attaque: weapon.attaque || 0,
                esquive: weapon.esquive || 0 ,
                degats: weapon.degats || 0,
                pv: weapon.PV || 0

        });
  })
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
      // Accédez aux valeurs du reactif form
      const formData = this.weaponForm.value;
      console.log(formData);
      // Ajoutez la logique de sauvegarde ici
    }}
    delete(): void {
        this.weaponService.deleteWeapon(this.id)
            .then(w => {
                console.log( this.id , 'à été suprimé');
                this.goBack();
            })
    }

}
