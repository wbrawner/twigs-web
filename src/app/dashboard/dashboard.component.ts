import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public balance: number;
  public transactions: Transaction[];

  constructor(
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.getBalance();
    this.getTransactions();
  }

  getBalance(): void {
    this.transactionService.getBalance().subscribe(balance => this.balance = balance)
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => this.balance = balance)
  }
}
