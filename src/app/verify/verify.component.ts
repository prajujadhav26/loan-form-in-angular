import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  formData: any;
  data: any;
  city: string = "";
  panNumber: string = "";
  fullname: string = "";
  email: string = "";
  mobile: string = "";
  otp: string = "";
  verify: any;
  countdown:any;
  otpcount: any = 0;
  isread: boolean = true;
  disableresend: boolean = false;
  isresend:boolean = false;

  constructor(private api: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.formData = new FormGroup({
      city: new FormControl("", Validators.compose([Validators.required])),
      panNumber: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")])),
      fullname: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(140)])),
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"), Validators.maxLength(255)])),
      mobile: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])),
      otp: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(4)]))
    })
  }

  submitData(data: any) {
    // console.log(this.formData);
    let obj = { mobile: data.mobile, otp: data.otp }
    console.log(obj);
    this.api.post("/verifyOTP.php", obj).subscribe((data: any) => {
      //  console.log(data.status);
      //  console.log(data.statusCode);
      console.log(data);
      if (data.status == "Success") {
        alert("Thank you for verification " + data.fullname)
      }
    })

  }

  mobiledata(event: Event) {
    let ctrl = (<HTMLInputElement>event.target);
    let mobiledt = ctrl.value;
    console.log(mobiledt);
    if (mobiledt.match("^((\\+91-?)|0)?[0-9]{10}$")) {
      // alert("correct");
      let obj = {
        panNumber: this.panNumber,
        city: this.city,
        fullname: this.fullname,
        email: this.email,
        mobile: this.mobile
      }
      console.log(obj);
      this.api.getotp("/getOTP.php", obj).subscribe((result: any) => {
        console.log(result);
        this.isread = false;
        // if (result.status == "Success") {
        //   this.disableresend == false;
        // }
      })
    }
  }

  resendotp(event:Event) {
    // alert("Hello");
    this.disableresend=true;
    let ctrl = (<HTMLInputElement>event.target).value;
    console.log(ctrl);

    this.isresend = true;
    setTimeout(() => {
      this.isresend = false;

    }, 30000);
    this.disableresend = true;
    this.otpcount += 1;
    // console.log(this.otpcount);
    if (this.otpcount == 3) {
      alert("Please try again after an hour.");
      this.disableresend = false;
      setTimeout(() => {
        this.disableresend = true;
      }, 3600000);
    }
  }
}
