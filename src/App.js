import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import './App.css';
import Users from "./components/users/Users";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import axios from 'axios';
import User from "./components/users/User";


class App extends Component {
    state = {
        users: [],
        repos: [],
        user: {},
        loading: false,
        alert: null,
    };

    // Search Github Users
    searchUsers = async (text) => {
        this.setState({loading: true});
        const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        this.setState({users: res.data.items, loading: false});
    };

    // Get single Github User
    getUser = async (username) => {
        this.setState({loading: true});
        const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        this.setState({user: res.data, loading: false});
    };

    // Get User repositories
    getUserRepos = async (username) => {
        this.setState({loading: true});
        const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        this.setState({repos: res.data, loading: false});
    };

    // Clear user from state
    clearUsers = () => this.setState({users: [], loading: false});

    // Fire an alert
    setAlert = (msg, type) => {
        this.setState({alert: {msg, type}});
        setTimeout(() => this.setState({alert: null}), 5000);
    };

    render() {
        const {users, user, loading, repos} = this.state;
        return (
            <Router>
                <div className="App">
                    <Navbar icon='fab fa-github' title='Github'/>
                    <div className='container'>
                        <Alert alert={this.state.alert}/>
                        <Switch>
                            <Route exact path='/' render={props => (
                                <Fragment>
                                    <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers}
                                            showClear={users.length > 0} setAlert={this.setAlert}/>
                                    <Users loading={loading} users={users}/>
                                </Fragment>
                            )}/>
                            <Route exact path='/about' component={About}/>
                            <Route exact path='/user/:login'
                                   render={props => (
                                       <User{...props} getUser={this.getUser} getUserRepos={this.getUserRepos}
                                            repos={repos} user={user} loading={loading}/>)}/>
                        </Switch>

                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
