const Courses = require("../models/courses");
// const express = require('express')

exports.allnames = async (req, res, next) => {
  //get all names of all events
  Courses.find({}, "name")
    .then((result) => {
      if (!result) {
        const error = new Error(`could find a match`);
        error.statusCode = 500;
        throw error;
      }
      //return res.json with all names
      res.status(200).json({
        names: result,
        message: "Returned all course names",
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
