import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  
  // discount price
  discountClick : boolean = false;
  discountAmount : boolean = false;
  // paypal 
  showPaypalStatus : boolean = false;
  showSuccess:boolean = false;
  

  // paypal
  public payPalConfig?: IPayPalConfig;

  offerClicked:boolean=false;
  paymentStatus : boolean = false;

  // To hold delivery Address Details
  username : string=''
  houseno : string=''
  street : string=''
  state : string=''
  phoneno : string=''

  totalPriceEachProduct = 0 // to hold total of single porduct

  totalprice = 0; // to hold total price 
  discountPrice = 0  // to hold discount price

  // to hold cart products
  allcart:any = []

  cartcounts:string='';

  constructor (private api:ApiService, private fb:FormBuilder){}

  // for form validation 
  
  addressForm = this.fb.group({
    username:['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    houseno:['', [Validators.required, Validators.pattern('[0-9]*')]],    
    street:['', [Validators.required,Validators.pattern('[a-zA-Z]*')]],
    state:['', [Validators.required,Validators.pattern('[a-zA-Z]*')]],
    phoneno:['', [Validators.required,Validators.pattern('[0-9]*')]]
  })

  ngOnInit(): void {

      this.api.cartitemcount.subscribe((data:any) => {
        console.log(data); //cartcount
        this.cartcounts=data

        // paypal function call
        this.initConfig();
      })

    this.api.getcart().subscribe((result:any) => {
      console.log(result); 
      this.api.cartCount()   
      this.allcart = result
      // call cart total price
      this.getcartTotal()

    },

    (result:any)=>{
      console.log(result.error);            
    })
  }

  removeCart(id:any){
    this.api.deleteCart(id).subscribe((result:any) => {
      this.allcart = result
      this.api.cartCount()
    },
    (result:any) => {
      alert(result.error)
    }
    )
  }

  // get cart total
  getcartTotal(){
    let total = 0;
    this.allcart.forEach((result:any) => {
      total+=result.grandTotal
      this.totalprice=Math.ceil(total)
      // Math.ceil to round numbers
    })
  }

  // increment cart count
  incrementCart(id:any){
    this.api.incrementCartCount(id).subscribe((result:any) => {
      this.allcart = result
      this.getcartTotal()
      this.cartcounts
    },
    (result:any) => {
      alert(result.error)
    }
    )
  }

  // decrement cart count
  decrementCart(id:any){
    this.api.decrementCartCount(id).subscribe((result:any) => {
      this.allcart = result
      this.getcartTotal()
      this.cartcounts
    },
    (result:any) => {
      alert(result.error)
    })
  }
  // proceed to pay
  submitpay(){
    if(this.addressForm.valid){
      //
      this.username = this.addressForm.value.username || '';
      this.houseno = this.addressForm.value.houseno || '';
      this.street  = this.addressForm.value.street ||'';
      this.state  = this.addressForm.value.state ||'';
      this.phoneno  = this.addressForm.value.phoneno ||'';

      this.paymentStatus = true

    }
    else{
      alert("Invalid Form")
    }
  }

  // Discount
  offerClick(){
    this.offerClicked = true
    this.discountClick = true
  }

  // discount
  discount(value:any){
    // this.discountPrice  = this.addressForm.value.totalprice ||'';
    this.discountPrice = this.totalprice*(100-value)/100
    this.offerClicked=false 
    this.discountAmount=true 
  }

  // /paypal payment

  private initConfig(): void {
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  paypalPay(){
    this.showPaypalStatus=true 
  }

    // close()
    close(){
      this.discountClick = false
      this.discountAmount = false
      this.paymentStatus = false 
      this.showPaypalStatus = false
      this.showSuccess = false
      this.addressForm.reset()
    }

}
