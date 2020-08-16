const rp = require("request-promise");
const https = require("https");
const fs = require("fs-extra");
const iToJson = require("ics-to-json");
const icsToJson = iToJson.default;
const path = require("path");
const mongoose = require("mongoose");

const CourseEvent = require("../models/courses");
const dirName = path.resolve(__dirname, "tmp");
const url =
  "https://www.haw-hamburg.de/hochschule/technik-und-informatik/departments/informations-und-elektrotechnik/studium/studienorganisation/studienplaene/";

exports.getCalendarEvents = async () => {
  //check and clear collection  prior to getting and setting new data
  await CourseEvent.deleteMany({}).then(() => {
    console.log("cleared collection");
  });
  console.log("getting ics data");
  const allIcsLinks = await getIcsLinks();
  for (let i = 0; i < allIcsLinks.length; i++) {
    try {
      const link = allIcsLinks[i];
      const icsData = await getIcsFileJsonContent(link);
      // console.log("converting ics data to json");
      // console.log(icsData);

      // console.log("populating mongodb with ics data");
      populateDB(icsData);
    } catch (error) {
      console.log(error);
    }
  }

  console.log("done getting ics data");
  await fs.emptyDir(dirName);
};

async function getIcsLinks() {
  try {
    const response = await rp(url);
    const icsLinks = response.match(
      /https?:\/\/www\.haw-hamburg\.de\/fileadmin\/TI-IE\/PDF\/Studium\/Studienorganisation\/Studienpläne\/Kalenderdateien\/[^"]*/g
    );
    // console.log(icsLinks);
    return icsLinks;
  } catch (err) {
    console.log("ERROR!!!");
    console.log(err);
  }
}

async function getIcsFileJsonContent(linkToIcsFile) {
  let fileLocation = path.resolve(
    dirName,
    linkToIcsFile.substring(linkToIcsFile.lastIndexOf("/") + 1)
  );
  await fs.promises
    .mkdir(dirName, { recursive: true })
    .catch((error) => console.log(error));

  const file = fs.createWriteStream(
    path.resolve(
      dirName,
      linkToIcsFile.substring(linkToIcsFile.lastIndexOf("/") + 1)
    )
  );

  let pr = new Promise((resolve, reject) => {
    const request = https.get(linkToIcsFile, function (response) {
      if (response.headers.location) {
        getIcsFileJsonContent(response.headers.location);
      } else {
        response.pipe(file);
        resolve();
      }
    });
    request.on("error", (err) => {
      reject(err);
    });
  });
  await pr;

  const data = await fs.readFile(fileLocation, "utf8");
  const icsData = icsToJson(data);
  return icsData;
}

async function populateDB(icsData) {
  promiseList = [];
  let isInList = true;
  let degree = "";
  let semester = "";
  icsData.forEach((event) => {
    if (event.summary.startsWith("E1")) {
      degree = "ET";
      semester = 1;
    } else if (event.summary.startsWith("E2")) {
      degree = "ET";
      semester = 2;
    } else if (event.summary.startsWith("E3")) {
      degree = "ET";
      semester = 3;
    } else if (event.summary.startsWith("E4")) {
      degree = "ET";
      semester = 4;
    } else if (event.summary.startsWith("E6")) {
      degree = "ET";
      semester = 6;
    } else if (event.summary.startsWith("E7")) {
      degree = "ET";
      semester = 7;
    } else if (event.summary.startsWith("B-REE1")) {
      degree = "REE";
      semester = 1;
    } else if (event.summary.startsWith("B-REE3")) {
      degree = "REE";
      semester = 3;
    } else if (event.summary.startsWith("B-REE6")) {
      degree = "REE";
      semester = 6;
    } else if (event.summary.startsWith("IE1")) {
      degree = "IE";
      semester = 1;
    } else if (event.summary.startsWith("IE3")) {
      degree = "IE";
      semester = 3;
    } else if (event.summary.startsWith("IE6")) {
      degree = "IE";
      semester = 6;
    } else if (event.summary.startsWith("IE7")) {
      degree = "IE";
      semester = 7;
    } else if (event.summary.startsWith("BMT1")) {
      degree = "MT";
      semester = 1;
    } else if (event.summary.startsWith("BMT2")) {
      degree = "MT";
      semester = 2;
    } else if (event.summary.startsWith("BMT3")) {
      degree = "MT";
      semester = 3;
    } else if (event.summary.startsWith("BMT4")) {
      degree = "MT";
      semester = 4;
    } else if (event.summary.startsWith("BMT6")) {
      degree = "MT";
      semester = 6;
    } else {
      isInList = false;
    }
    if (isInList) {
      const courseEvent = new CourseEvent({
        //replacing / and whitespace
        name: event.summary.replace('/', '__').replace(/\s/g, '_'),
        semester: semester,
        degree: degree,
        lecturer: event.description,
        room: event.location,
        dstart: event.startDate,
        dend: event.endDate,
      });
      promiseList.push(courseEvent.save());
    }
  });
  const results = await Promise.all(promiseList);
  // console.log(results);
}
