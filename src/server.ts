import express from 'express'
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes  from './routes';

config({path:"./.env"})
const app=express();
const port=process.env.PORT
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','PUT','PATCH','POST','DELETE'],
    credentials:true
}))
app.options('*',cors());

app.use('/v1',routes);


try{
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
}catch(err){
    console.log(err)
}