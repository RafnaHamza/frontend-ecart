import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allwishlist:any = []   //To hold all wishlist items
  
  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.getwishlist().subscribe((result:any)=>{
      console.log(result);      
      this.allwishlist = result //array of wishlist products
    },
    (result:any)=>{
      console.log(result.error);      
    })
  }

  // delete wishlist products
  deletewishlist(id:any){
    this.api.deletewishlist(id).subscribe((result:any)=>{
      console.log(result); //remaining wishlist products
      this.allwishlist = result       
    })
  }

  // add to cart
  addtocart(product:any){

    // add quantity to cart
    Object.assign(product,{quantity:1})

    // api call to add quantity

    this.api.addtocart(product).subscribe((result:any) => {
    this.api.cartCount()
    this.deletewishlist(product.id)
    alert(result);
  },
  (result:any) => {
    alert(result.error);
  })
}

}
