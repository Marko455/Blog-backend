import express from "express"
import cors from "cors"
import storage from "./memory_storage.js"
import requestTime from "./middleware/requestTime.js"
const app = express();
app.use(cors())
const port = 3000;

app.get("/posts", (req, res)=>{
    let title = req.query.title
    let postovi = storage.posts
    
    if(title){
     postovi = postovi.filter(e => {
        return e.title.indexOf(title) >= 0
     })
    }

    res.json(postovi)
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
    res.status(201).send()
});

app.post('/register', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
    res.status(201).send()
});

app.use(requestTime);

app.get('/time', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${req.requestTime}</small>`
    res.send(responseText)
  })
app.listen(port, ()=> console.log('Slušam na portu: ${port}'));
console.log("Tip podatka storage:", typeof storage.posts);

