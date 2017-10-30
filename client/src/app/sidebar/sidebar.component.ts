import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ClientsService } from '../services/clients.service';
import { ClientModel } from '../models/client';
import { Router } from '@angular/router';
import { logout, currentUser } from '../../utils/authentication';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [ClientsService],
})
export class SidebarComponent implements AfterViewInit, OnInit {
  constructor(private router: Router, private clientsService: ClientsService) {}
  clients: ClientModel[];
  user: any;

  ngOnInit(): void {
    this.user = currentUser();
    console.log(this.user);
  }

  logout(): void {
    logout();
    this.router.navigate(['./login']);
  }

  searchBarControls() {
    $('button[href="#search"]').on('click', function(event) {
      event.preventDefault();
      $('#search').addClass('open');
      $('#search > form > input[type="search"]').focus();
    });

    $('.close').on('click', function(event) {
      $('#search').removeClass('open');
    });

    $(document).on('keyup', function(event) {
      if (event.keyCode == 27) {
        $('#search').removeClass('open');
      }
    });

    //Do not include! This prevents the form from submitting for DEMO purposes only!
    $('form').submit(function(event) {
      event.preventDefault();
      return false;
    });
  }

  ngAfterViewInit() {
    const self = this;
    var trigger = $('.hamburger'),
      overlay = $('.overlay'),
      isClosed = false;

    trigger.click(function() {
      hamburger_cross();
    });

    function hamburger_cross() {
      if (isClosed == true) {
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
    }

    $('[data-toggle="offcanvas"]').click(function() {
      $('#wrapper').toggleClass('toggled');
    });

    this.searchBarControls();
  }
}
