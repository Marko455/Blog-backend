import express from "express"
import cors from "cors"
import {storage} from "./memory_storage.js"  // improvizacija baze
//import {storage2} from "./memory_storage.js"  // objave sa mongoDB-a
import requestTime from "./middleware/requestTime.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
app.use(cors())
const port = 3000;
app.use(express.json())
import User from "./models/User.js"
// Povezivanje na MongoDB Atlas
import db from "./connection.js";
let userCollection = db.collection("Users")
let postsCollection = db.collection("Posts")


app.get("/kolekcija", async (req, res) => {
  try {
    const postovi = await postsCollection.find({}).toArray();
    console.log(postovi);

    res.json(postovi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/signup', async (req, res) => {
  debugger
  userCollection
  const { email, password } = req.body;
  const existingUser = await userCollection.findOne({ email });

  if (existingUser) {
    return res.status(400).send('Email je vec koristen');
  }

  if (password.length < 6) {
    return res.status(400).send('Lozinka mora biti minimalno 6 znakova');
  }

  let hash_password = await bcrypt.hash(password, 10)
  try {
    const user = await userCollection.insertOne({email, hash_password});
    res.status(201).json(user);
  }
  catch(err) {
    console.log(err);
    res.status(400).send('Pogreska, korisnik nije kreiran');
  }
 
});


app.get('/login', async (req, res) => {
  const { email, password } = req.query;

  try {
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Pogresan email ili lozinka' });
    }

    console.log(email);
    console.log(password);
    console.log(user.hash_password);

    if (!user.hash_password) {
      return res.status(500).send('Netocni korisnicki podaci');
    }

    const passwordMatch = bcrypt.compare(password, user.hash_password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Pogresan email ili lozinka' });
    }

    const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '60s' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

 
app.post('/login', async (req, res) => {
  const { email, password} = req.body
  console.log(email, password);
  res.send('user login');
  res.status(201).send()
});

app.get('/logout', (req, res) => {
  res.redirect('/login');
});


/*
app.patch('/posts/:postId', (req, res) => {
Ruta za uređivanje već napravljenih objava
}
*/


//console.log(storage2)    //ispis objava sa mongoDB-a za provjeru
//Pokušaj rada sa middleware-om
app.use(requestTime);

app.get('/time', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${req.requestTime}</small>`
    res.send(responseText)
  })
app.listen(port, ()=> console.log('Slušam na portu: ${port}'));
console.log("Tip podatka storage:", typeof storage.posts);

/* Podaci za BODY Postman-a
{
    "email": "marko@google.com",
    "password": "$2b$10$kFREqjiTAW/2I0oxkg.MDOnFnwA6B7NBV2sGGyV.XjM7KkLpNyMhu"
}
*/