import Vue from "vue"
import Vuex from "vuex"

import modules from "./modules"

Vue.use(Vuex);

//存储状态数据容器
const state = {

};

//存储只读计算属性数据容器
const getters = {};
//包含n个用来间接修改state的函数对象
const actions = {};
//包含n个用来直接修改state的函数对象
const mutations = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules,
})


