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

      <!-- <v-alert prominent color="blue-grey" style="z-index: 10">
        <v-row align="center">
          <v-col class="grow">
            All information is without guarantees.
            
          </v-col>
          
          <v-col class="shrink">
            <v-btn>Okay</v-btn>
          </v-col>
        </v-row>
      </v-alert> -->
      <v-footer app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <v-spacer></v-spacer>
        <v-btn icon href="https://github.com/flowreaction/haw-calendar-viewer">
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

    toggleTheme() {
      this.$vuetify.theme.dark = this.themeSwitchToDark;
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
