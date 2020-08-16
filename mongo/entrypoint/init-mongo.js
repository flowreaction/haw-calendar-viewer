db.createUser({
  user: "node-app",
  pwd: "1234",
  roles: [
    {
      role: "readWrite",
      db: "hawcourses",
    },
  ],
});