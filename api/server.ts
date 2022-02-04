const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const expressJwt = require('express-jwt');
const fs = require("fs");
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();
const db = require('./db.json');
import fetch from 'cross-fetch';

server.use(middlewares);
server.use(jsonServer.bodyParser);

const RSA_PRIVATE_KEY= fs.readFileSync('./keys/private.key');
const RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');

const checkIfAuthenticated = ()=>{ 
    // console.log(Buffer.from(RSA_PUBLIC_KEY, 'base64'))
    expressJwt({
        secret: Buffer.from(RSA_PUBLIC_KEY, 'base64'),
        algorithms: ['RS256']
    })
};


server.post('/api/login',(req:any,res:any)=>{
    const email = req.body?.email;
    const password = req.body?.password;    
    if (email && password) {
    console.log(email)
        getUsers().then(
            (users)=>{
                if(users && validateUser(email,password,users)){
                    const userId = findUserId(users,email);
                    const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 900,
                            subject: userId+''
                        })
                    res.status(200).json({
                        idToken: jwtBearerToken, 
                        expiresIn: 900
                    });      
                }
            }
        )
        res.status(401);
    }
    res.status(401);
})
// server.get('/api/lessons',checkIfAuthenticated,(req:any,res:any)=>{res.status(200).send('hello')})

// function login(req:any, res:any){
//     const email = req.body?.email,
//           password = req.body?.password;    
//     if (email && password) {
//         getUsers().then(
//             (users)=>{
//                 console.log(users);
//                 if(users && validateUser(email,password,users)){
//                     const userId = findUserId(users,email);
//                     const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
//                             algorithm: 'RS256',
//                             expiresIn: 900,
//                             subject: userId+''
//                         })
//                     res.status(200).json({
//                         idToken: jwtBearerToken, 
//                         expiresIn: 900
//                     });      
//                 }
//             }
//         )
//         res.status(401);
//     }
//     res.status(401);
// }

async function getUsers(){
    const response:any= await fetch('http://localhost:3000/db.json');
    console.log(response.json());
    return await response.json();
}

function validateUser(email:string,password:string, users:any[]):boolean{
    let isValid = false;
    users.forEach(el=>{
        if((el.email===email)&&(el.password===password)){
            isValid=true;
        }
    })
    return isValid;
}

function findUserId(users:any[],email:string):number{
    let id:number;
    users.forEach(el=>{
        if(el.email===email){
            id=el.id;
        }
    })
    return id;
}

server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
  });
