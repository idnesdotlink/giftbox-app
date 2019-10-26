import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";

import { MenuController, IonSlides } from "@ionic/angular";

import { Storage } from "@ionic/storage";

@Component({
  selector: "page-intro",
  templateUrl: "intro.html",
  styleUrls: ["./intro.scss"],
})
export class IntroPage {
  showSkip = true;

  @ViewChild("slides", { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage
  ) {}

  startApp() {
    this.router
      .navigateByUrl("/app/tabs/schedule")
      .then(() => this.storage.set("ion_did_intro", true));
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ionViewWillEnter() {
    this.storage.get("ion_did_intro").then(res => {
      if (res === true) {
        this.router.navigateByUrl("/app/tabs/schedule");
      }
    });

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the intro page
    this.menu.enable(true);
  }
}