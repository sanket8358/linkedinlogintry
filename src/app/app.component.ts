import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

declare var cordova:any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
    userDetails:any;
    success:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private http:Http
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.userDetails="loading";
      this.success="loading";
    });
  }
 
  linkLogin() {
    this.platform.ready().then(() => {
       // this.linkedInLogin().then(success => {  
            let headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });
            let options = new RequestOptions({
                headers: headers
            });
            var data: any;
            //this.success=success.json();
            data = "grant_type=authorization_code&code=AQSA23vr8z5J1JzZnEckPqZkshT9HXCQIj-k-jLYsC8arIq6lXFQD50-U-dftna6dqeWrBx1BUvGyqQSoannaaasgftUjoqPVYMwQKp5uquDSyKoX2l1nJcdT4sNlMcQwAmR0IppR4qm0duzT_fBvm3SZeRFCxvlvSa5te1kHs4q7Y5l5NSlIXYNOB6QYw&redirect_uri=https://joinsmart.herokuapp.com/api/auth/callback&client_id=81sirvv927wpon&client_secret=t4OpCZ376aWqhOFe";
            let body = data;
            this.http.post("https://www.linkedin.com/oauth/v2/accessToken", body, options).toPromise()
            .then(res => {
                let result = res.json();
                if (result["access_token"] !== undefined) {
                    this.getLinkedInUserDetails(result["access_token"]).then(response => {
                        console.log("response is the JSON containing the user details from Linkedin.");
                        this.userDetails=response;
                    }).then((data) => {
                        this.userDetails=data;
                    });
                } else {
                    this.userDetails="in else of login";
                }
            }, err => {
                console.log("Failed");
                this.userDetails="Failed "+err;
            });
        }, (error) => {
            console.log("error : " + error);
            this.userDetails="error "+error;
        });
    //});
}

linkedInLogin(): Promise<any> {
    return new Promise(function (resolve, reject) {
        var uri = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81sirvv927wpon&" + "redirect_uri=https://joinsmart.herokuapp.com/api/auth/callback&scope=r_emailaddress%20r_liteprofile";
        var browserRef =  cordova.InAppBrowser.open(uri);
  
        browserRef.addEventListener("loadstart", (event) => {
            if ((event.url).indexOf('joinsmart.herokuapp.com/api/auth/callback') >= 0) {
                browserRef.removeEventListener("exit", (event) => { });
                browserRef.close();
                var parsedResponse = {};
                var code = (event.url.split("=")[1]).split("&")[0];
                var state = event.url.split("=")[2];
                if (code !== undefined && state !== null) {
                    parsedResponse["code"] = code;
                    resolve(parsedResponse);
                } else {
                    this.userDetails="code is null";
                }
            }
        });
        
    });
}

getLinkedInUserDetails(token: string) {
    let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
    });
    let options = new RequestOptions({
        headers: headers,
    });
    return this.http.get("https://api.linkedin.com/v2/me", options).toPromise()
   .then(res => res.json(), err => err);
}
}
