import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { Budget } from '../budget';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/users/user';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';

@Component({
    selector: 'app-add-edit-budget',
    templateUrl: './add-edit-budget.component.html',
    styleUrls: ['./add-edit-budget.component.css']
})
export class AddEditBudgetComponent {
    @Input() title: string;
    @Input() budget: Budget;
    public userIds: number[];
    public searchedUsers: User[] = [];

    constructor(
        private app: AppComponent,
        @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    ) {
        this.app.title = this.title;
        this.app.backEnabled = true;
        this.userIds = [this.app.user.id];
    }

    save(): void {
        let observable;
        if (this.budget.id) {
            // This is an existing transaction, update it
            observable = this.twigsService.updateBudget(this.budget.id, this.budget);
        } else {
            // This is a new transaction, save it
            observable = this.twigsService.createBudget(
                this.budget.name,
                this.budget.description,
                this.userIds
            );
        }
        // TODO: Check if it was actually successful or not
        observable.subscribe(val => {
            this.app.goBack();
        });
    }

    delete(): void {
        this.twigsService.deleteBudget(this.budget.id);
        this.app.goBack();
    }

    // TODO: Implement a search box with suggestions to add users
    searchUsers(username: string) {
        this.twigsService.getUsersByUsername(username).subscribe(users => {
            this.searchedUsers = users;
        });
    }

    clearUserSearch() {
        this.searchedUsers = [];
    }
}
