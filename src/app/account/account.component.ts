import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LoggingService } from "../logging.service";
import { AccountsService } from "../account.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
  // do not pass in AccountsService to retain the same instance from the parent, which has the accounts data you want.
  providers: [LoggingService]
})
export class AccountComponent {
  @Input() account: { name: string; status: string };
  @Input() id: number;

  constructor(private accountsService: AccountsService) {}

  onSetTo(status: string) {
    this.accountsService.updateStatus(this.id, status);
    // use event emitter in service to emit an event to outside components(new-account component) which can listen for it:
    this.accountsService.statusUpdated.emit(status);
  }
}
