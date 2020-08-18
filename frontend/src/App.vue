<template>
  <v-app id="inspire">
    <v-app id="inspire">
      <v-navigation-drawer app clipped fixed permanent width="330px">
        <v-list-item>
          <v-list-item-content class="text-subtitle-2"
            >Select Your Courses below</v-list-item-content
          >
        </v-list-item>
        <v-list dense>
          <v-list-group v-for="(degree, h) in getCourses" :key="h" no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ degree.name }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-group
              v-for="(semester, i) in degree.semesters"
              :key="i"
              no-action
              sub-group
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ semester.name }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item-group multiple>
                <v-list-item
                  v-for="(course, j) in semester.courses"
                  :key="j"
                  @input="toggleSelected($event, course)"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        color="primary"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-title
                      v-text="course.replace('__', '/').replace('_', ' ')"
                    ></v-list-item-title>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left flat>
        <v-toolbar-title>HAW Calendar Viewer</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-switch
          flat
          label="Dark Theme"
          color="red"
          hide-details
          v-model="themeSwitchToDark"
          @change="toggleTheme"
        ></v-switch>
      </v-app-bar>

      <v-main>
        <v-container class="fill-height" fluid>
          <v-row class="fill-height">
            <v-col>
              <v-sheet height="64">
                <v-toolbar flat>
                  <v-btn outlined class="mr-4" @click="setToday"
                    >Semester Begin</v-btn
                  >
                  <v-btn fab text small @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn class="ml-1" fab text small @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                  </v-btn>

                  <v-toolbar-title class="ml-3" v-if="$refs.calendar">{{
                    $refs.calendar.title
                  }}</v-toolbar-title>
                </v-toolbar>
              </v-sheet>
              <v-sheet style="height: 95%">
                <v-calendar
                  show-week
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="getEvents"
                  type="month"
                  event-more
                  start="2020-10-01"
                  :weekdays="weekdays"
                  @click:event="showEvent"
                ></v-calendar>
                <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
                >
                  <v-card color="grey lighten-5" min-width="350px" flat>
                    <v-toolbar color="blue-grey darken-1" dark>
                      <v-toolbar-title
                        v-html="selectedEvent.name"
                      ></v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                      <span v-html="selectedEvent.room"></span>
                      <br />
                      <span v-html="selectedEvent.lecturer"></span>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        text
                        color="secondary"
                        @click="selectedOpen = false"
                        >Cancel</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-alert
        v-model="alert" 
        outlined text 
        transition="slide-y-reverse-transition"
        icon="mdi-information-outline"
        prominent
        style="z-index: 10; position: absolute; bottom: 1vh; backdrop-filter: blur(3px)"
        class="mx-6 mb-12"
      >
        <h3 class="headline">Hi there,</h3>
        <div>
          all events should always be up to date. Once a day all the calendar
          events are laoded from the HAW website and made accessible to you. If
          you are interested in how this app was built, visit my
          <button @click="goToGithub()">github here</button>.
          <br />
          <br />
          Nonetheless, all information shown here is without guarantees.
        </div>
        <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>
        <v-row align="center" no-gutters>
          <v-col class="grow">
            Cookies are being used on this site, but you can opt out if you so
            desire by clicking no thanks.
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="shrink mr-3">
            <v-btn  outlined @click="optIn()">
              Okay <v-icon right>mdi-cookie</v-icon>
            </v-btn>
          </v-col>
          <v-col class="shrink">
            <v-btn  outlined @click="optOut()">
              no thanks
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-footer app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          href="https://github.com/flowreaction/haw-calendar-viewer"
          target="_blank"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-footer>
    </v-app>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  data: () => ({
    alert: true,
    eventInputCounter: 0,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],

    themeSwitchToDark: false,
    selectedCourses: [],
    degrees: {
      et: {
        name: "Elektrotechnik",
        courses: ["et1", "et2", "el1", "el2", "el3", "oop"],
      },
      re: {
        name: "Regernerative Systeme",
        courses: ["1", "2", "3", "4", "5", "6"],
      },
    },
  }),
  computed: {
    ...mapGetters(["getCourses"]),
    ...mapGetters(["getEvents"]),
  },
  methods: {
    ...mapActions(["fetchNames"]),
    ...mapActions(["fetchCouseJsonData"]),
    ...mapActions(["deleteEvents"]),
    optIn() {
      this.alert = false;
      this.$ga.enable();
    },
    optOut() {
      this.alert = false;
      this.$ga.disable();
    },
    toggleTheme() {
      this.$vuetify.theme.dark = this.themeSwitchToDark;
    },
    goToGithub() {
      window.open(
        "https://github.com/flowreaction/haw-calendar-viewer",
        "_blank"
      );
    },
    toggleSelected(payload, course) {
      if (payload === true) {
        setTimeout(() => {
          this.eventInputCounter = 0;
        }, 50);
        if (this.eventInputCounter === 0) {
          console.log(course);
          this.fetchCouseJsonData(course);
          this.eventInputCounter++;
        }
      } else {
        console.log(course);
        this.deleteEvents(course);
      }
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },

    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
  },
  created() {
    this.$vuetify.theme.dark = false;
    this.fetchNames();
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
};
</script>
