const Courses = require("../models/courses");
// const express = require('express')

exports.allnames = async (req, res, next) => {
  //get all names of all events
  Courses.distinct("name")
    .then((result) => {
      if (!result) {
        const error = new Error(`could find a match`);
        error.statusCode = 500;
        throw error;
      }
      //structure courses based on degree>semester>coursenames
      console.log(result);
      const structured = structure(result);

      //return res.json with all names
      res.status(200).json({
        data: structured,
        message: "Returned all course names in a structured format",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "Error occured getting course Names, check Server Logs",
      });
    });
};

exports.specifiednames = async (req, res, next) => {
  //get events matching req.params.degree and req.params.semester
  Courses.find(
    {
      degree: decodeURIComponent(req.params.degree),
      semester: decodeURIComponent(req.params.semester),
    },
    "name"
  )
    .then((result) => {
      if (!result) {
        const error = new Error(`could find a match`);
        error.statusCode = 500;
        throw error;
      }
      //return matching event names
      res.status(200).json({
        names: result,
        message: "Returning matching course names",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "Error occured getting course Names, check Server Logs",
      });
    });
};

exports.events = async (req, res, next) => {
  //filter all events for eents with name of req.params.name
  Courses.find({
    name: decodeURIComponent(req.params.name),
  })
    .then((result) => {
      if (!result) {
        const error = new Error(`could find a match`);
        error.statusCode = 500;
        throw error;
      }
      //return res json with all matching events
      res.status(200).json({
        events: result,
        message: "Returning matching events",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "Error occured getting course Names, check Server Logs",
      });
    });
};

/**
 * @param {Array} result Expecting array of events containting name semester and degree information
 * @return {Object} structuredCourses
 */
function structure(result) {
  const structuredCourses = {
    EI: {
      name: "Elektro - u. Informationstechnik",
      semesters: {
        semester1: {
          name: "Semester 1",
          courses: [],
        },
        semester2: {
          name: "Semester 2",
          courses: [],
        },
        semester3: {
          name: "Semester 3",
          courses: [],
        },
        semester4: {
          name: "Semester 4",
          courses: [],
        },
        semester6: {
          name: "Semester 6",
          courses: [],
        },
        semester7: {
          name: "Semester 7",
          courses: [],
        },
      },
    },
    REE: {
      name: "Regene­rative Energie­systeme und Energie­manage­ment",
      semesters: {
        semester1: {
          name: "Semester 1",
          courses: [],
        },

        semester3: {
          name: "Semester 3",
          courses: [],
        },

        semester6: {
          name: "Semester 6",
          courses: [],
        },
      },
    },
    IE: {
      name: "Infor­mation Engi­neering",
      semesters: {
        semester1: {
          name: "Semester 1",
          courses: [],
        },
        semester3: {
          name: "Semester 3",
          courses: [],
        },
        semester6: {
          name: "Semester 6",
          courses: [],
        },
        semester7: {
          name: "Semester 7",
          courses: [],
        },
      },
    },
    BMT: {
      name: "Mechatronik",
      semesters: {
        semester1: {
          name: "Semester 1",
          courses: [],
        },
        semester2: {
          name: "Semester 2",
          courses: [],
        },
        semester3: {
          name: "Semester 3",
          courses: [],
        },
        semester4: {
          name: "Semester 4",
          courses: [],
        },
        semester6: {
          name: "Semester 6",
          courses: [],
        },
      },
    },
  };
  for (let index = 0; index < result.length; index++) {
    const courseName = result[index];
    if (courseName.startsWith("E1")) {
      structuredCourses.EI.semesters.semester1.courses.push(courseName);
    } else if (courseName.startsWith("E2")) {
      structuredCourses.EI.semesters.semester2.courses.push(courseName);
    } else if (courseName.startsWith("E3")) {
      structuredCourses.EI.semesters.semester3.courses.push(courseName);
    } else if (courseName.startsWith("E4")) {
      structuredCourses.EI.semesters.semester4.courses.push(courseName);
    } else if (courseName.startsWith("E6")) {
      structuredCourses.EI.semesters.semester6.courses.push(courseName);
    } else if (courseName.startsWith("E7")) {
      structuredCourses.EI.semesters.semester7.courses.push(courseName);
    } else if (courseName.startsWith("B-REE1")) {
      structuredCourses.REE.semesters.semester1.courses.push(courseName);
    } else if (courseName.startsWith("B-REE3")) {
      structuredCourses.REE.semesters.semester3.courses.push(courseName);
    } else if (courseName.startsWith("B-REE6")) {
      structuredCourses.REE.semesters.semester6.courses.push(courseName);
    } else if (courseName.startsWith("IE1")) {
      structuredCourses.IE.semesters.semester1.courses.push(courseName);
    } else if (courseName.startsWith("IE3")) {
      structuredCourses.IE.semesters.semester3.courses.push(courseName);
    } else if (courseName.startsWith("IE6")) {
      structuredCourses.IE.semesters.semester6.courses.push(courseName);
    } else if (courseName.startsWith("IE7")) {
      structuredCourses.IE.semesters.semester7.courses.push(courseName);
    } else if (courseName.startsWith("BMT1")) {
      structuredCourses.BMT.semesters.semester1.courses.push(courseName);
    } else if (courseName.startsWith("BMT2")) {
      structuredCourses.BMT.semesters.semester2.courses.push(courseName);
    } else if (courseName.startsWith("BMT3")) {
      structuredCourses.BMT.semesters.semester3.courses.push(courseName);
    } else if (courseName.startsWith("BMT4")) {
      structuredCourses.BMT.semesters.semester4.courses.push(courseName);
    } else if (courseName.startsWith("BMT6")) {
      structuredCourses.BMT.semesters.semester6.courses.push(courseName);
    }
  }
  return structuredCourses;
}
