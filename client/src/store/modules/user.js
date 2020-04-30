import axios from 'axios';

const state = {
    user: undefined,
    potentialNeighbors: undefined
};

const getters = {
    getUser: state => state.user,
    isLoggedIn: state => !!state.user,
    getPotentialNeighbors: state => state.potentialNeighbors
};

const actions = {
    signup({ commit }, userData) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'http://127.0.0.1:8000/user/signup',
                data: userData,
                method: 'POST'
            })
            .then(response => {
                commit('updateUser', response.data);
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    login({ commit }, loginData) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'http://127.0.0.1:8000/user/login',
                data: loginData,
                method: 'POST'
            })
            .then(response => {
                commit('updateUser', response.data);
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    logout({ commit }) {
        localStorage.removeItem('user');
        commit('logout');
    },
    fetchUser({ commit }) {
        var storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            storedUser = undefined;
        }
        commit('updateUser', storedUser);
    },
    updateUser({ commit }, userData) {
        commit('updateUser', userData);
    },
    updateLocation({ commit}, userLocationData) {
        const locationData = {
            'latitude': userLocationData.latitude,
            'longitude': userLocationData.longitude
        }
        return new Promise((resolve, reject) => {
            axios({
                url: 'http://127.0.0.1:8000/user/' + userLocationData.userId,
                data: locationData,
                method: "PATCH"
            })
            .then(response => {
                commit('updateUser', response.data);
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    fetchPotentialNeighbors({ commit }) {
        axios({
            url: 'http://127.0.0.1:8000/user/nearby/' + state.user.id,
            method: 'GET'
        })
        .then(response => {
            commit('updatePotentialNeighbors', response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }
};

const mutations = {
    updateUser: (state, userData) => {
        state.user = userData;
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    },
    updatePotentialNeighbors(state, potentialNeighbors) {
        state.potentialNeighbors = potentialNeighbors;
    },
    logout: (state) => {
        state.user = undefined;
        state.potentialNeighbors = undefined;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
