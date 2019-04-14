export class Category {
  constructor(public id: number,
    public name: string,
    public hasSubCategory: boolean,
    public parentId: number) { }
}

export class Product {
  constructor(public id: number,
    public name: string,
    public images: Array<any>,
    public oldPrice: number,
    public newPrice: number,
    public discount: number,
    public ratingsCount: number,
    public ratingsValue: number,
    public description: string,
    public availibilityCount: number,
    public cartCount: number,
    public color: Array<string>,
    public size: Array<string>,
    public weight: number,
    public categoryId: number,
    public user: any) { }
}

export class User {
  constructor(public id: number,
    public name: string,
    public imageurl: string,
    public address: string) { }
}
export interface IOrder {
  user: string,
  serviceProvider: string,
  address: string,
  description: string,
  date: object,
  hiringDate: string,
  time: string,
  category: string,
  status: string
}

export interface ISearch {
  lat: number,
  lng: number,
  category: string,
  distance: number
}

export interface IReview {
  comments: string,
  rating: number,
  givenBy: string,
  givenTo: string,
  order: string,
  reviewType: string
}