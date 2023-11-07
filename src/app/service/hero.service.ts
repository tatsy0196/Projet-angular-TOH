import { Injectable } from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc
} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";
import {DocumentData} from "rxfire/firestore/interfaces";
import {Hero} from "../data/hero";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // URL d'accès aux documents sur Firebase
  private static url = 'heroes';

  constructor(private firestore: Firestore) {
  }

  getHeroes(): Observable<Hero[]> {

    // get a reference to the user-profile collection
    const heroCollection = collection(this.firestore, HeroService.url);

    ///////////
    // Solution 2 : Transformation en une liste d'objets de type Hero
    return collectionData(heroCollection, { idField: 'id' }).pipe(
      map( (documents) => documents.map((heroDocumentData) => {
        return HeroService.transformationToHero(heroDocumentData);
      }))) as Observable<Hero[]>;
  }

  getHero(id: string): Observable<Hero> {

    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + "/" + id);

    ///////////
    // Solution 2 : Transformation en un objet de type Hero
    return docData(heroDocument, { idField: 'id' }).pipe(     // Ajout de l'id dans le document data
      map( (heroDocumentData) => {
        return HeroService.transformationToHero(heroDocumentData);
      })) as Observable<Hero>;
  }

  addHero(): Promise<Hero> {

    // get a reference to the hero collection
    const heroCollection = collection(this.firestore, HeroService.url);
    let hero: Hero = new Hero();

    let heroPromise: Promise<Hero> = new Promise( (resolve, reject) => {
      addDoc(heroCollection, HeroService.transformationToJSON(hero)).then(
        heroDocument => { // success
          hero.id = heroDocument.id;
          resolve(hero);
        },
        msg => { // error
          reject(msg);
        });
    });

    //
    return heroPromise;
  }

  updateHero(hero: Hero): Promise<void> {

    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + "/" + hero.id);

    // Update du document à partir du JSON et du documentReference
    return updateDoc(heroDocument, HeroService.transformationToJSON(hero));
  }

  deleteHero(id: string): Promise<void> {

    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + "/" + id);

    //
    return deleteDoc(heroDocument);
  }

  private static transformationToHero(heroDocumentData: DocumentData): Hero {

    ///////
    // Il est nécessaire de concerver l'id du document dans l'objet de type Hero
    ///////


    // Solution 2 : création de l'objet de type Hero en utilisant la méthode fromJSON de la classe Hero
    // Conversion du document data en chaine JSON puis chargment de l'objet par défaut Hero
    let heroTmp: Hero = new Hero();
    heroTmp.fromJSON(JSON.stringify(heroDocumentData));
    return heroTmp;
  }

  private static transformationToJSON(hero: Hero): any {

    ///////
    // Il n'est pas nécessaire d'evnoyer l'id dans le corps du document donc suppression de cette information
    ///////

    // Solution 2 : création d'un JSON object en supprimant la propriété id
    let newHeroJSON = Object.assign({}, hero);   // Cette solution met l'id dans firebase au niveau du document
    delete newHeroJSON.id;

    //
    return newHeroJSON;
  }

}
