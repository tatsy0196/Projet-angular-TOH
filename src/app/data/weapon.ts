export class Weapon {
  id: string;
  name: string;
  attaque: number;
  esquive: number;
  degats: number ;
  pv: number;

  constructor(id: string = "id_test", name: string = "brindille", attaque: number = 0, esquive: number = 0, degats: number = 0, pv: number = 0) {
  this.id = id;
  this.name = name;
  this.attaque = attaque;
  this.esquive = esquive;
  this.degats = degats;
  this.pv = pv;
}

isValide(): boolean {
  return  (this.attaque >= 0)
      && (this.esquive >= 0)
      && (this.degats >= 0)
      && (this.pv >= 0)
      && (this.attaque + this.esquive + this.degats + this.pv) <= 0 ;
}


fromJSON(jsonStr: string): void {

  let jsonObj = JSON.parse(jsonStr);
  for (const propName in jsonObj) {
  (this as any)[propName] = jsonObj[propName];
}
}
}
