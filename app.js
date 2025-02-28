const dotenv = require('dotenv');

const cors = require('cors');
const express= require('express');
const app = express();
const connectToDb = require('./db/db.js');
const userRoutes = require('./routes/user.route');
const questionRoutes = require('./routes/question.route.js')
const cookieParser = require('cookie-parser');

connectToDb();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("hello world");
});
app.use('/users',userRoutes);
app.use('/question',questionRoutes);
// app.use('/captains',captainRoutes);
// app.use('/maps',mapsRoute);
// app.use('/rides', rideRoutes);

module.exports = app;