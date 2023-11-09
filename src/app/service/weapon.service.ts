import { Injectable } from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc
} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";
import {DocumentData} from "rxfire/firestore/interfaces";
import {Weapon} from "../data/weapon";

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  // URL d'accès aux documents sur Firebase
  private static url = 'weapons';

  constructor(private firestore: Firestore) {
  }

  getWeapons(): Observable<Weapon[]> {

    // get a reference to the user-profile collection
    const weaponCollection = collection(this.firestore, WeaponService.url);

    ///////////
    return collectionData(weaponCollection, { idField: 'id' }).pipe(
        map( (documents) => documents.map((weaponDocumentData) => {
          return WeaponService.transformationToWeapon(weaponDocumentData);
        }))) as Observable<Weapon[]>;
  }


  addWeapon(): Promise<Weapon> {

    // get a reference to the weapon collection
    const weaponCollection = collection(this.firestore, WeaponService.url);
    let weapon: Weapon = new Weapon();

    let weaponPromise: Promise<Weapon> = new Promise( (resolve, reject) => {
      addDoc(weaponCollection, WeaponService.transformationToJSON(weapon)).then(
        weaponDocument => { // success
          weapon.id = weaponDocument.id;
          resolve(weapon);
        },
        msg => { // error
          reject(msg);
        });
    });

    //
    return weaponPromise;
  }

  updateWeapon(weapon: Weapon): Promise<void> {

    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + "/" + weapon.id);

    // Update du document à partir du JSON et du documentReference
    return updateDoc(weaponDocument, WeaponService.transformationToJSON(weapon));
  }





  deleteWeapon(id: string): Promise<void> {

    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + "/" + id);

    //
    return deleteDoc(weaponDocument);
  }

  private static transformationToWeapon(weaponDocumentData: DocumentData): Weapon {

    ///////
    // Il est nécessaire de concerver l'id du document dans l'objet de type Weapon
    ///////


    // Solution 2 : création de l'objet de type Weapon en utilisant la méthode fromJSON de la classe Weapon
    // Conversion du document data en chaine JSON puis chargment de l'objet par défaut Weapon
    let weaponTmp: Weapon = new Weapon();
    weaponTmp.fromJSON(JSON.stringify(weaponDocumentData));
    return weaponTmp;
  }

  private static transformationToJSON(weapon: Weapon): any {

    ///////
    // Il n'est pas nécessaire d'evnoyer l'id dans le corps du document donc suppression de cette information
    ///////

    // Solution 2 : création d'un JSON object en supprimant la propriété id
    let newWeaponJSON = Object.assign({}, weapon);   // Cette solution met l'id dans firebase au niveau du document
    delete newWeaponJSON.id;

    //
    return newWeaponJSON;
  }



}
