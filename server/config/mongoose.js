const mongoose = require('mongoose');
const dotenv = require('dotenv') ;

dotenv.config()


const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error' ,console.error.bind(console, 'error connecting to db'));

db.once('open',function(){
    console.log("Successfully connected to database");
})

module.exports = db;