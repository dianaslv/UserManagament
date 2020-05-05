import React from 'react';
import { Table, Menu, Icon, Button, Input,Label } from 'semantic-ui-react';
import { get } from 'axios';
import times from 'lodash.times';
import { Helmet } from 'react-helmet';
import {Link, Route} from 'react-router-dom';
import Page from './Page';
import UserInfo from './UserInfo';
import Navbar from "./Cms/Navbar";

import users from '../../../users.json';


const TOTAL_PER_PAGE = 10;

class Users extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: users,
      displayedUsers:[],
      username: '',
      page: 0,
      totalPages: 0,
      searchValue:'',
      warningLabel:'Press enter for search'
    };
    this.incrementPage = this.incrementPage.bind(this);
    this.decrementPage = this.decrementPage.bind(this);
    this.setPage = this.setPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.checkSearchValue = this.checkSearchValue.bind(this);
    this.getUsersToDisplay = this.getUsersToDisplay.bind(this);
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    this.setState({username: params.username});
    console.log(this.state.username);
    this.getUsers();
  }

  componentWillReceiveProps({ location = {} }) {
    if (location.pathname === '/reservations' && location.pathname !== this.props.location.pathname) {
      this.getUsers();
    }
  }
  getUsers() {

        const totalPages = Math.ceil(users.length / TOTAL_PER_PAGE);

        this.setState({
          users: users,
          displayedUsers: users,
          page: 0,
          totalPages,
        });
      }


  setPage(page) {
    return () => {
      this.setState({ page });
    };
  }

  decrementPage() {
    const { page } = this.state;

    this.setState({ page: page - 1 });
  }

  incrementPage() {
    const { page } = this.state;

    this.setState({ page: page + 1 });
  }

  handleDelete(userId) {
    const { users } = this.state;

    this.setState({
      users: users.filter(u => u.id !== userId),
    });
  }

  handleChange(e) {
    this.setState({searchValue:e.target.value})
    console.log(this.state.searchValue)
  }

  checkSearchValue(user) {
    console.log(user);
    const {searchValue} = this.state;
    Object.keys(user).map((e,i) => {
      console.log(user[e].toString().toLowerCase());
      console.log(searchValue.toString().toLowerCase());
      if(
          user[e].toString().toLowerCase().includes(searchValue.toString().toLowerCase())) {
        console.log(user[e].toString().toLowerCase());
        console.log(searchValue.toString().toLowerCase());
        return true;
      }
    })
    return false;
  }

  getUsersToDisplay() {
    const {searchValue} = this.state;
    const { users } = this.state;
    const usersToDisplay = [];
    users.filter(user => {
          Object.keys(user).map((e,i) => {
            if (user[e].toString().toLowerCase().includes(searchValue.toString().toLowerCase())){
             usersToDisplay.push(user);
            }
          })
        }

    )
    return usersToDisplay;
  }

  handleKeyDown(e) {
    const {searchValue} = this.state;
    const { users } = this.state;
    console.log(this.state.searchValue)
    if (e.key === 'Enter') {
      if(searchValue === ''){
        this.setState({
          displayedUsers: users,
          searchValue:'',
          warningLabel:'cold t find any name'
        });
      }
      else{
        console.log(users);
      this.setState({
        displayedUsers: this.getUsersToDisplay(),
        searchValue:'',
        warningLabel:'Press enter for search'
      });
      }
    }
  }

  render() {
    const { displayedUsers, page, totalPages, username,warningLabel } = this.state;
    const startIndex = page * TOTAL_PER_PAGE;
    console.log(username);
    console.log(this.state.displayedUsers);
    return (
      <Page title="Reservations">
        <Helmet>
          <title>Reservations</title>
        </Helmet>
        <Navbar username={username}/>
        <Input placeholder='Search...' value={this.state.searchValue} onChange={this.handleChange} onKeyDown={this.handleKeyDown}/>
        <Label pointing='left' >{warningLabel}</Label>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {displayedUsers.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(user =>
              (<Table.Row key={user.id}>
                <Link to={`/reservations/${username}/${user.id}/info`} >
                <Table.Cell>{user.name}</Table.Cell>
                </Link>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.address}</Table.Cell>
              </Table.Row>),
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={6}>
                <Menu floated="right" pagination>
                  {page !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                    <Icon name="left chevron" />
                  </Menu.Item>}
                  {times(totalPages, n =>
                    (<Menu.Item as="a" key={n} active={n === page} onClick={this.setPage(n)}>
                      {n + 1}
                    </Menu.Item>),
                  )}
                  {page !== (totalPages - 1) && <Menu.Item as="a" icon onClick={this.incrementPage}>
                    <Icon name="right chevron" />
                  </Menu.Item>}
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Link to={`/reservations/${username}/new`}>
          <Button positive>New reservation</Button>
        </Link>
        <Route path="/reservations/:username/:userId/info" component={UserInfo} />
      </Page>
    );
  }

}

export default Users;
