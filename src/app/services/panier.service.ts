import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { panier } from '../panier.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  cartdata:any=[];
  public cartItemList : any =[]
  
  
  private _url='http://localhost:9191/Panier/'
  constructor(private http: HttpClient) { }


  
addToCart(payload:any)  :Observable<any>{
  console.log("add")
 // let userJSON = JSON.stringify(payload);

  console.log(payload)

  return this.http.post<panier>(this._url+"addpanier", payload ,{headers: {"Content-Type":"application/json; charset=UTF-8"}});
}
deletecartItmes(id:any )
{
  return this.http.delete<panier>(`${this._url+"delete"}/${id}`);

}


deletenftsold(id:any )
{console.log("deleetefrompanier")

  return this.http.delete<panier>(`${this._url+"deleteBuyPanier"}/${id}`);
}

getCartItems(id:any): Observable<any>  {
  return this.http.get(`${this._url+"findAllPanier"}/${id}`);
}

MustFav()  {
  return this.http.get(this._url+"favoriteMust");
}
}
