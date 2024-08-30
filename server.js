require("dotenv").config();
const express = require("express");
const http = require("http");
const { dbConnect } = require("./config.js/db");
const bodyParser = require("body-parser")
const userRouter = require('./routes/userRoute');

const app = express();
const server = http.createServer(app);

dbConnect();

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());


app.use('/api/v1/users', userRouter);

const port = process.env.PORT;
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
