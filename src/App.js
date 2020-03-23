import React, {Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import './App.css';
import Users from "./components/users/Users";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import axios from 'axios';
import User from "./components/users/User";


const App = ({}) => {
    const [users, setUsers] = useState([]);
    const [repos, setRepos] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Search Github Users
    const searchUsers = async (text) => {
        setLoading(true);
        const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        setUsers(res.data.items);
        setLoading(false);
    };

    // Get single Github User
    const getUser = async (username) => {
        setLoading(true);
        const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        setUser(res.data);
        setLoading(false);
    };

    // Get User repositories
    const getUserRepos = async (username) => {
        setLoading(true);
        const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
        setRepos(res.data);
        setLoading(false);
    };

    // Clear user from state
    const clearUsers = () => {
        setUsers([]);
        setLoading(false);
    };

    // Fire an alert
    const showAlert = (msg, type) => {
        setAlert({msg, type});
        setTimeout(() => setAlert(null), 5000);
    };

    return (
        <Router>
            <div className="App">
                <Navbar icon='fab fa-github' title='Github'/>
                <div className='container'>
                    <Alert alert={alert}/>
                    <Switch>
                        <Route exact path='/' render={props => (
                            <Fragment>
                                <Search searchUsers={searchUsers} clearUsers={clearUsers}
                                        showClear={users.length > 0} setAlert={showAlert}/>
                                <Users loading={loading} users={users}/>
                            </Fragment>
                        )}/>
                        <Route exact path='/about' component={About}/>
                        <Route exact path='/user/:login'
                               render={props => (
                                   <User{...props} getUser={getUser} getUserRepos={getUserRepos}
                                        repos={repos} user={user} loading={loading}/>)}/>
                    </Switch>

                </div>
            </div>
        </Router>
    );
};

export default App;
