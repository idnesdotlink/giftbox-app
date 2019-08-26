import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  IonList,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";

import { ProductCategoryFilterPage } from "../product-category-filter/product-category-filter";
import { ProductCategoryData } from "../../providers/product-category-data";
import { UserData } from "../../providers/user-data";

@Component({
  selector: "page-product-category",
  templateUrl: "product-category.html",
  styleUrls: ["./product-category.scss"],
})
export class ProductCategoryPage implements OnInit {
  // Gets a reference to the list element
  @ViewChild("scheduleList", { static: true }) scheduleList: IonList;

  dayIndex = 0;
  queryText = "";
  segment = "all";
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public confData: ProductCategoryData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public toastCtrl: ToastController,
    public user: UserData
  ) {}

  ngOnInit() {
    this.updateProductCategory();
  }

  updateProductCategory() {
    // Close any open sliding items when the product updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData
      .getTimeline(
        this.dayIndex,
        this.queryText,
        this.excludeTracks,
        this.segment
      )
      .subscribe((data: any) => {
        this.shownSessions = data.shownSessions;
        this.groups = data.groups;
      });
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ProductCategoryFilterPage,
      componentProps: { excludedTracks: this.excludeTracks },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateProductCategory();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, "Favorite already added");
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      const alert = await this.alertCtrl.create({
        header: "Favorite Added",
        buttons: [
          {
            text: "OK",
            handler: () => {
              // close the sliding item
              slidingItem.close();
            },
          },
        ],
      });
      // now present the alert on top of all other content
      await alert.present();
    }
  }

  async removeFavorite(
    slidingItem: HTMLIonItemSlidingElement,
    sessionData: any,
    title: string
  ) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: "Would you like to remove this session from your favorites?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
        {
          text: "Remove",
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateProductCategory();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
      ],
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: Math.random() * 1000 + 500,
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
