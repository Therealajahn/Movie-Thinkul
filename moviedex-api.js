require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require("morgan");
const movieData = require('./movies-data');
const helmet = require('helmet');
const cors = require('cors');


const morganSetting = process.env.NODE_ENV === 'production'?
                      'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use((error,req,res,next)=>{
    let request
    if(process.env.NODE_ENV === 'production'){
        response = {error: {message: 'Server error'} }
    }else{
        response = { error };
    }
    res.status(500).json(response);
})

app.use(function validateApiKey(req,res,next){
    const apiKey = process.env.API_KEY;
    const authKey = req.get('Authorization').split(' ')[1];

    if(!authKey || authKey !== apiKey){
       return res.status(401).json({error: "Unathorized request"}); 
    }
    next();
})

app.get('/',(res)=>{
    res.send('empty url');
})
app.get('/movie',(req,res)=>{
    
    const {genre="", country="",avg_vote="0"} = req.query;
    
   let result = 
        movieData.filter(movie => 
            movie.genre
            .toLowerCase()
            .includes(genre.toLowerCase())
        );
    
     
    result = result.filter(movie => 
            movie.country
            .toLowerCase()
            .includes(country.toLowerCase())
        )
    
    result = result.filter(movie => 
            movie.avg_vote >= parseInt(avg_vote)
        ) 
    
     
    
    
    res.json(result);   
})

const PORT = process.env.PORT || 3000;
app.listen(PORT);