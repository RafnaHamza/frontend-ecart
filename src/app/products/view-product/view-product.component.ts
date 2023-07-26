import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  productId:any  //to hold  id of particular product
  product:any = {} // to hold details of the particular product(selected product)

  constructor(private viewActivatedRoute:ActivatedRoute, private api:ApiService){}
  // ActivatedRoute is to get path parameter from route

  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data:any)=>{
      console.log(data); //id:1
      console.log(data.id); //1
      this.productId = data.id;
      // view particular product details
      this.api.viewproduct(this.productId).subscribe((result:any)=>{
        console.log(result); //array of particular product
        this.product = result; 
      })
    })
  }

  // add to wishlist
  addtowishlist(){
    const { id,title,price,image } = this.product
    // api call
    this.api.addtowishlist(id,title,price,image).subscribe((result:any)=>{
      alert(result);
    },
    (result:any)=>{
      alert(result.error);
    })
  }

  // Add to cart
  addtocart(product:any){
    // add quantity 1 to product object 
    Object.assign(product,{quantity:1})
    
    console.log(product);
    this.api.addtocart(product).subscribe((result:any) => {
      this.api.cartCount()
      // alert(result) //add to Cart
    },
    (result:any) => {
      alert(result.error) //Error message
    })
    
  }
}
