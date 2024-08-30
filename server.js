require("dotenv").config();
const express = require("express");
const http = require("http");
const { dbConnect } = require("./config.js/db");
const bodyParser = require("body-parser")
const userRouter = require('./routes/userRoute');
const AppError = require('./utils/appError')

const app = express();
const server = http.createServer(app);

dbConnect();

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());


app.use('/api/v1/users', userRouter);

// Handling 404 Errors
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Global error handler
app.use(require('./controllers/error'));

const port = process.env.PORT;
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
