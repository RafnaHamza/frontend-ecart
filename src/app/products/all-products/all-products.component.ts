import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  searchTerm: string='';
  product:any = {}

    // to hold array of products
  allProducts:any=[]
  
  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.api.getAllProducts().subscribe((result:any)=>{
      console.log(result);//array of products
      this.allProducts=result;      
    })
    // this.searchTerm = this.api.searchTerm
    this.api.searchTerm.subscribe((result)=>{
      this.searchTerm = result
      console.log(this.searchTerm);
      
    })
    console.log(this.searchTerm);
    
  }

  // Add to cart
  addtocart(product:any){
    // add quantity 1 to product object 
    Object.assign(product,{quantity:1})
    this.api.addtocart(product).subscribe((result:any) => {
      this.api.cartCount()
      alert("Item Added To Your Cart") //add to Cart
    },
    (result:any) => {
      alert(result.error) //Error message
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
}




  
