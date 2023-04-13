import { BehaviorSubject } from 'rxjs';
import Router from 'next/router'
import axios from 'axios';
//import getConfig from 'next/config';

const baseUrl = `${process.env.PUBLIC_API_URL}/api/bytepro/user`;
const userSubject = new BehaviorSubject(
    process.browser 
    && (localStorage.getItem('user') == null ? null : JSON.parse(localStorage.getItem('user') ?? '{}'))
);

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout
};

async function login(username: string, password: string) {
    const resp = await axios.post(`${baseUrl}/Login`, { username, password }).catch(err => err.response);
    if(resp.status == 200){
        const user = resp.data;
        userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }
    else {
        localStorage.removeItem('user');
        userSubject.next(null);
    }

    return resp;
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}