import express from "express"
import cors from "cors"
import storage from "./memory_storage.js"  // improvizacija baze
import requestTime from "./middleware/requestTime.js"
import jwt from "jsonwebtoken";
//import { authenticateToken } from './middlewares/authenticateToken.js'
//import { checkEmailLength } from "./middlewares/abac.js"; 
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
    res.status(201).send()
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.vue');
    res.status(201).send()
});

app.post('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.vue');
    res.status(201).send()
});

app.patch('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    const updatedPost = req.body;
  
    
    const index = storage.posts.findIndex(post => post.id === postId);
  
    if (index !== -1) {  // U slučaju da imam indeks 0 za prvu blog objavu
      storage.posts[index] = {       //Ako se pronađe odgovarajuća objava, ovaj redak ažurira post spajanjem postojećih podataka o postu s ažuriranim podacima o postu.
        ...storage.posts[index],     //Koristi operator spread (...) za stvaranje novog objekta koji kombinira 
        ...updatedPost               // svojstva postojeće objave (storage.posts[index]) sa svojstvima ažurirane objave (updatedPost).
      };                             // DALNJE ISTRAŽITI
      res.json({ message: 'Blog objava ažurirana' });
    } else {
      res.status(404).json({ error: 'Blog objava nije pronadena' });
    }
  });
  
//Pokušaj rada sa middleware-om
app.use(requestTime);

app.get('/time', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${req.requestTime}</small>`
    res.send(responseText)
  })
app.listen(port, ()=> console.log('Slušam na portu: ${port}'));
console.log("Tip podatka storage:", typeof storage.posts);

