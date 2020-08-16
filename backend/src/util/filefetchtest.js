const rp = require("request-promise");
const https = require("https");
const fs = require("fs-extra");
const iToJson = require("ics-to-json");
const icsToJson = iToJson.default;
const path = require("path");

const CourseEvent = require("../models/courses");
const url =
  "https://www.haw-hamburg.de/hochschule/technik-und-informatik/departments/informations-und-elektrotechnik/studium/studienorganisation/studienplaene/";

getCalendarEvents = async () => {
  const allIcsLinks = await getIcsLinks();
  for await (const link of allIcsLinks) {
    try {
      const icsData = await getIcsFileJsonContent(link);
      console.log(icsData);
      populateDB(icsData);
    } catch (error) {
      console.log(error);
    }
  }
};
async function getIcsLinks() {
  try {
    const response = await rp(url);
    const icsLinks = response.match(
      /https?:\/\/www\.haw-hamburg\.de\/fileadmin\/TI-IE\/PDF\/Studium\/Studienorganisation\/Studienpläne\/Kalenderdateien\/[^"]*/g
    );
    return icsLinks;
  } catch (err) {
    console.log("ERROR!!!");
    console.log(err);
  }
}

async function getIcsFileJsonContent(linkToIcsFile) {
  const dirName = path.resolve(__dirname, "tmp");
  let fileLocation = path.resolve(
    dirName,
    linkToIcsFile.substring(linkToIcsFile.lastIndexOf("/") + 1)
  );
  console.log(fileLocation);
  await fs.promises
    .mkdir(dirName, { recursive: true })
    .then(console.log(`created dir: ${dirName}`))
    .then(await fs.emptyDir(dirName))
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
  // console.log(icsData)
  return icsData;
}

async function populateDB(icsData) {
  promiseList = [];
  let isNotInList = false;
  let degree = "";
  let semester = "";
  icsData.forEach((event) => {
    if (event.summary.startsWith("E1")) {
      degree = "ET";
      semester = 1;
    } else if (course.name.startsWith("E2")) {
      degree = "ET";
      semester = 2;
    } else if (course.name.startsWith("E3")) {
      degree = "ET";
      semester = 3;
    } else if (course.name.startsWith("E4")) {
      degree = "ET";
      semester = 4;
    } else if (course.name.startsWith("E6")) {
      degree = "ET";
      semester = 6;
    } else if (course.name.startsWith("E7")) {
      degree = "ET";
      semester = 7;
    } else if (course.name.startsWith("B-REE1")) {
      degree = "REE";
      semester = 1;
    } else if (course.name.startsWith("B-REE3")) {
      degree = "REE";
      semester = 3;
    } else if (course.name.startsWith("B-REE6")) {
      degree = "REE";
      semester = 6;
    } else if (course.name.startsWith("IE1")) {
      degree = "IE";
      semester = 1;
    } else if (course.name.startsWith("IE3")) {
      degree = "IE";
      semester = 3;
    } else if (course.name.startsWith("IE6")) {
      degree = "IE";
      semester = 6;
    } else if (course.name.startsWith("IE7")) {
      degree = "IE";
      semester = 7;
    } else if (course.name.startsWith("BMT1")) {
      degree = "MT";
      semester = 1;
    } else if (course.name.startsWith("BMT2")) {
      degree = "MT";
      semester = 2;
    } else if (course.name.startsWith("BMT3")) {
      degree = "MT";
      semester = 3;
    } else if (course.name.startsWith("BMT4")) {
      degree = "MT";
      semester = 4;
    } else if (course.name.startsWith("BMT6")) {
      degree = "MT";
      semester = 6;
    } else {
      isNotInList = true;
    }
    if (!isNotInList) {
      const courseEvent = new CourseEvent({
        name: event.summary,
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
  return results;
}

getCalendarEvents();
