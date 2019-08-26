import { Injectable } from "@angular/core";
import { CanLoad, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
@Injectable({
  providedIn: "root",
})
export class CheckIntro implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  canLoad() {
    return this.storage.get("ion_did_intro").then(res => {
      if (res) {
        this.router.navigate(["/app", "tabs", "schedule"]);
        return false;
      } else {
        return true;
      }
    });
  }
}
