const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const mongoose = require("mongoose");

const getCalendarEvents = require("./util/calendar-fetcher").getCalendarEvents;

//import routes
const routes = require("./routes/index");

//Creating express app
const app = express();

//allowing CORS
app.use(cors());

//adding bodyparser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//setting port
const PORT = process.env.PORT || 3000;

// handling routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
app.use("/courses", routes);

mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@mongodb:27017/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on Port: ${PORT}`);
      getCalendarEvents();
      console.log("scheduling cron tasks");
      cron.schedule("0 0 0 * * *", () => {
        console.log("CRON: getting ics files");
        getCalendarEvents();
      });
    });
  })
  .catch((err) => {
    console.log("ERROR on mongoose connect: " + err);
  });
