import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    courses: {},
    events: [],
    API_URL: `${window.location.protocol}://${window.location.host}/api`,
  },
  getters: {
    getCourses: (state) => state.courses,
    getEvents: (state) => state.events,
  },
  actions: {
    async fetchNames({ state, commit }) {
      try {
        var response = await axios({
          crossdomain: true,
          method: "GET",
          url: state.API_URL + "/courses/allnames",
        });
        console.log(response.data);
        commit("setCourses", response.data);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchCouseJsonData({ state, commit }, course) {
      try {
        const response = await axios({
          method: "GET",
          url: `${state.API_URL}/courses/events/${course}`,
        });
        const eventdata = response.data.events.map(
          ({ dstart, dend, ...rest }) => {
            return {
              start: moment(dstart).format("YYYY-MM-DD HH:mm"),
              end: moment(dend).format("YYYY-MM-DD HH:mm"),
              ...rest,
            };
          }
        );
        console.log(response);
        commit("addEvents", eventdata);
      } catch (err) {
        console.log(err);
      }
    },
    deleteEvents({ state, commit }, courseName) {
      commit(
        "deleteEvents",
        state.events.filter((event) => event.name !== courseName)
      );
    },
  },
  mutations: {
    setCourses: (state, data) => {
      state.courses = { ...data.data };
    },
    addEvents: (state, data) => {
      state.events.push(...data);
    },
    deleteEvents: (state, newEvents) => {
      state.events = [...newEvents];
    },
  },
  modules: {},
});
