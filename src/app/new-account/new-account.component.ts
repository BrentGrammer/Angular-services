import { Component } from "@angular/core";
import { LoggingService } from "../logging.service";
import { AccountsService } from "../account.service";

@Component({
  selector: "app-new-account",
  templateUrl: "./new-account.component.html",
  styleUrls: ["./new-account.component.css"],
  providers: [LoggingService]
})
export class NewAccountComponent {
  constructor(private accountsService: AccountsService) {
    //event emitted from account component using the service:
    this.accountsService.statusUpdated.subscribe((status: string) =>
      alert("New Status: " + status)
    );
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName, accountStatus);
  }
}
