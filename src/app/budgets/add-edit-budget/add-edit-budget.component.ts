import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { Budget } from '../budget';
import { AppComponent } from 'src/app/app.component';
import { User, UserPermission, Permission } from 'src/app/users/user';
import { TWIGS_SERVICE, TwigsService } from 'src/app/shared/twigs.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-edit-budget',
    templateUrl: './add-edit-budget.component.html',
    styleUrls: ['./add-edit-budget.component.css']
})
export class AddEditBudgetComponent {
    @Input() title: string;
    @Input() budget: Budget;
    @Input() create: boolean;
    public users: UserPermission[];
    public searchedUsers: User[] = [];
    public isLoading = false;

    constructor(
        private app: AppComponent,
        private router: Router,
        @Inject(TWIGS_SERVICE) private twigsService: TwigsService,
    ) {
        this.app.setTitle(this.title)
        this.app.setBackEnabled(true);
        this.users = [new UserPermission(this.app.user.value.id, Permission.OWNER)];
    }

    save(): void {
        let promise: Promise<Budget>;
        this.isLoading = true;
        if (this.create) {
            // This is a new budget, save it
            promise = this.twigsService.createBudget(
                this.budget.id,
                this.budget.name,
                this.budget.description,
                this.users
            );
        } else {
            // This is an existing budget, update it
            promise = this.twigsService.updateBudget(this.budget.id, this.budget);
        }
        // TODO: Check if it was actually successful or not
        promise.then(_ => {
            this.app.goBack();
        });
    }

    delete(): void {
        this.isLoading = true;
        this.twigsService.deleteBudget(this.budget.id)
            .then(() => {
                this.router.navigateByUrl("/budgets");
            });
    }

    // TODO: Implement a search box with suggestions to add users
    searchUsers(username: string) {
        this.twigsService.getUsersByUsername(username).then(users => {
            this.searchedUsers = users;
        });
    }

    clearUserSearch() {
        this.searchedUsers = [];
    }
}
