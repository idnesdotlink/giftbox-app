import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";
import { FCM } from '@ionic-native/fcm/ngx';

import {
  Events,
  MenuController,
  Platform,
  ToastController
} from "@ionic/angular";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Storage } from "@ionic/storage";

import { UserData } from "./providers/user-data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: "Categories",
      url: "/app/tabs/product-category",
      icon: "calendar",
    },
    {
      title: "Map",
      url: "/app/tabs/map",
      icon: "map",
    },
    {
      title: "About",
      url: "/app/tabs/about",
      icon: "information-circle",
    },
  ];
  loggedIn = false;

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private fcm: FCM
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: "Update available!",
        showCloseButton: true,
        position: "bottom",
        closeButtonText: `Reload`,
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      const token = await this.fcm.getToken();
      console.log(token);
      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
      });
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    this.events.subscribe("user:login", () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe("user:signup", () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe("user:logout", () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl("/app/tabs/schedule");
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set("ion_did_tutorial", false);
    this.router.navigateByUrl("/tutorial");
  }

  openIntro() {
    this.menu.enable(false);
    this.storage.set("ion_did_intro", false);
    this.router.navigateByUrl("/intro");
  }
}
