import { Component, OnInit } from '@angular/core';

import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

const USER_SUBSCRIPTION = gql`
  subscription  {
    userSubscription {
      node {
        firstname
      }
    }
  }
`;

const USER_QUERY = gql`
  query users {
    users {
      firstname
    }
  }
`;


@Component({
  selector: 'app-home',
  template: `

  <ul>
    <li *ngFor="let item of usersData">
        {{ item.firstname }}
    </li>
  </ul>

  `,
  styles: []
})
export class HomeComponent implements OnInit {

  usersQuery: QueryRef<any>;
  users: Observable<any>;
  params: any;

  usersData: any;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.usersQuery = this.apollo.watchQuery({
      query: USER_QUERY
    });

    this.usersQuery.valueChanges.subscribe(
      data => {
        console.log(data);
        if (data.loading === false) {
          this.usersData = data.data.users;
        }

      });

    this.subscribeToNewUsers();

  }

  subscribeToNewUsers() {
    this.usersQuery.subscribeToMore({
      document: USER_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newUserItem = subscriptionData.data.userSubscription;

        console.log(subscriptionData.data);

        console.log(newUserItem.node, prev);

        return Object.assign({}, prev, {
          users: [...prev['users'], newUserItem.node]
        });
      }
    });
  }

}

