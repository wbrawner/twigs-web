import { Component, OnInit } from '@angular/core';
import { Account } from '../account';

@Component({
    selector: 'app-new-account',
    templateUrl: './new-account.component.html',
    styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {

    public account: Account;

    constructor() {
        this.account = new Account();
    }

    ngOnInit() {
    }

}
