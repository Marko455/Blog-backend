import express from "express"
import cors from "cors"
import storage from "./memory_storage.js"  // improvizacija baze
import requestTime from "./middleware/requestTime.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import bcrypt
const app = express();
app.use(cors())
const port = 3000;
app.use(express.json())
import User from "./models/User.js"
// Povezivanje na MongoDB Atlas
import db from "./connection.js";
let userCollection = db.collection("Users")
let postsCollection = db.collection("Posts")


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

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/Signup.vue');
  res.status(201).send()
});

app.post('/signup', async (req, res) => {
  debugger
  userCollection
  const { email, password } = req.body;

  try {
    const user = await userCollection.insertOne({email, password});
    res.status(201).json(user);
  }
  catch(err) {
    console.log(err);
    res.status(400).send('pogreska, user nije kreiran');
  }
 
});

app.get('/login', (req, res) => {
  
}); 
 
app.post('/login', async (req, res) => {
  const { email, password} = req.body
  console.log(email, password);
  res.send('user login');
  res.status(201).send()
});

app.post('/register', (req, res) => {
    
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

