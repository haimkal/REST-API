const http = require('http');
const url = require('url');
const fs = require('fs');

class User {

    constructor(username, password){
        this.username= username;
        this.password = password;
    }
}

http.createServer((req, res) => {
    if (req.method=== 'PUT' && req.url.includes ('/user')){
        const query = url.parse(req.url, true).query;
        const {username='', password=''} = query;
        const newUser = new User(username,password);
        readFile((users)=> {
            users.push(newUser);
            saveFile(users, ()=> {
                res.write(`user ${username} created`);
                res.end();
            });
        });
    }else if(req.method === 'GET' && req.url.includes('/user')){
        readFile((users)=> {
            res.write(JSON.stringify(users));
            res.end();
        })
        
    } else if (req.method==='DELETE' && req.url.includes('/user')) {
        readFile((users)=> {
           const query = url.parse(req.url, true).query;
           const index = users.findIndex((user)=> user.username === query.username);
           if( index > -1) {
               users.splice(index, 1);
               saveFile(users, ()=> {
                res.write(`user ${query.username} was deleted`);
                res.end();
                })
                return;
            } 

            res.write(`user ${query.username} does not exist`);
            res.end();
        })   
    } else if (req.method==='POST' && req.url.includes('/user')) {
        readFile((users)=> {
            const query = url.parse(req.url, true).query;
            const index = users.findIndex((user)=> user.username===query.username);
            if( index > -1) {
               users[index].username = query.newUsername;
               users[index].password = query.newPassword; 
            //    Object.assign(users[index], query);
               saveFile(users, ()=> {
                 res.write(`user ${query.username} was changed to ${query.newUsername}`);
                 res.end();
                 })
                 return;
             } 
 
             res.write(`user ${query.username} does not exist`);
             res.end();
        })
    }
    
           
}).listen(4000);

function saveFile(content, cb) {
    fs.writeFile('./src/db.json', JSON.stringify(content), cb);
}

function readFile(cb) {
    fs.readFile('./src/db.json',{encoding: 'utf-8'}, (error, content)=> {
        cb(JSON.parse(content));
    });
}

console.log('Listening on: http://localhost:4000');
