const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({path:"./configs/config.env"});


const app = express();
app.use(express.json())


const usersRoute = require('./routes/users');

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/users',usersRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}...`);
})