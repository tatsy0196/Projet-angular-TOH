export class Weapon {
  id: string | undefined;
  name: string;
  attaque: number;
  esquive: number;
  degats: number ;
  PV: number;
  owner: string | undefined;

  constructor(id: string = "id_test", name: string = "brindille", attaque: number = 0, esquive: number = 0, degats: number = 0, PV: number = 0, owner = undefined) {
  this.id = id;
  this.name = name;
  this.attaque = attaque;
  this.esquive = esquive;
  this.degats = degats;
  this.PV = PV;
  this.owner = owner ;
}

isValide(): boolean {
  return  (this.attaque >= 0)
      && (this.esquive >= 0)
      && (this.degats >= 0)
      && (this.PV >= 0)
      && (this.attaque + this.esquive + this.degats + this.PV) <= 0 ;
}


fromJSON(jsonStr: string): void {

  let jsonObj = JSON.parse(jsonStr);
  for (const propName in jsonObj) {
  (this as any)[propName] = jsonObj[propName];
}
}
}
