import { Component, OnInit } from '@angular/core';
import { SearchOption } from '../models/search-options';

import { RecordsService } from '../services/records.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  providers: [RecordsService]
})
export class SearchBarComponent implements OnInit {
  options: SearchOption[];
  errors: string;
  records;
  input;
  selectedOption: string;
  constructor(private recordsService: RecordsService) {
    this.options = [
      new SearchOption('custkey', 'CustKey'),
      new SearchOption('phone1', 'Phone 1'),
      new SearchOption('firstname', 'First Name'),
      new SearchOption('lastname', 'Last Name'),
      new SearchOption('address1', 'Address 1'),
      new SearchOption('suburb', 'Suburb'),
      new SearchOption('state', 'State'),
      new SearchOption('mobilephone', 'Mobile Phone'),
      new SearchOption('homephone', 'Home Phone'),
      new SearchOption('source', 'Source'),
      new SearchOption('isDuplicate', 'Duplicate'),
      new SearchOption('isInvalid', 'Invalid')
    ];
  }

  hideRecords() {
    this.records = '';
  }

  setErrors(option) {
    this.errors = '';
    if (!option) {
      this.errors = 'Please select an option.';
    }
    const slice = option.slice(0, 2);

    if (!this.input && slice != 'is') {
      if (this.errors) {
        this.errors += ' Please enter a search value.';
      } else {
        this.errors = 'Please enter a search value.';
      }
    }
  }

  formatQuery(option, input) {
    const query = {};
    const slice = option.slice(0, 2);
    if (slice === 'is') {
      input = true;
    }
    query[option] = input;
    return query;
  }

  search(option) {
    this.setErrors(option);
    if (this.errors.length > 0) return;

    const query = this.formatQuery(option, this.input);
    this.recordsService
      .search(query)
      .then(data => {
        console.log(data);
        this.records = data;
        this.selectedOption = '';
        this.input = '';
      })
      .catch(error => {
        this.errors = error.json().message;
      });
  }

  ngOnInit() {}
}
