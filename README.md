# community-calendar-BACKEND

A local event app serving municipalities and neighborhoods. -

## Database

The database is setup in three different phase, `development`, `test`, `staging` and `production`. By default mongodb runs on port 27017, so make sure that this port is free and that there are no other instance of mongodb runnning on that same port on our machine. The development server is at `mongodb://localhost:27017/community_calender`.

To test in development mode you will need to do the following.

- [Download](https://www.mongodb.com/download-center/enterprise) & Install mongodb on your local machine.
- Make sure that mongodb is set to your environmemt path variables, if not add it to path.
- Create a folder named data on your local machine, make sure to put this folder outside the code folder structure.
- Run the command `mongod --dbpath=<path-to-your-data folder in step III]>`.
- `npm run server` the api will spin up making a connection to the database.
