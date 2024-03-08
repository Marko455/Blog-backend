import express from "express"
import cors from "cors"
import {storage} from "./memory_storage.js"  // improvizacija baze
import requestTime from "./middleware/requestTime.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
app.use(cors())
const port = 3000;
app.use(express.json())
import { ObjectId } from 'mongodb';
// Povezivanje na MongoDB Atlas
import db from "./connection.js";
let userCollection = db.collection("Users")
let postsCollection = db.collection("Posts")


// Sve objave:
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


// Svi korisnici:
app.get("/korisnici", async (req, res) => {
  try {
    const korisnici = await userCollection.find({}).toArray();
    console.log(korisnici);

    res.json(korisnici);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Samo određena objava po ID-u
app.get("/kolekcija/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("postId:", postId);
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Izrada objave:
app.post("/kolekcija", async (req, res) => {
  try {
    const { title, source, video, description, postedAt, createdBy, likes, dislikes, comment} = req.body;

    const novaObjava = {
      title,
      source,
      video,
      description,
      postedAt,
      createdBy,
      likes: 0,
      dislikes: 0,
      comment
    };

    const objava = await postsCollection.insertOne(novaObjava);

    res.status(201).json(objava);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Uređivanje objave:
app.patch("/kolekcija/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Netocan blog ID" });
    }

    const { title, source, video, description, postedAt, createdBy, likes, dislikes } = req.body;

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (source) updatedFields.source = source;
    if (video) updatedFields.video = video;
    if (description) updatedFields.description = description;
    if (postedAt) updatedFields.postedAt = postedAt;
    if (createdBy) updatedFields.createdBy = createdBy;
    if (likes) updatedFields.likes = likes;
    if (dislikes) updatedFields.dislikes = dislikes;


    const result = await postsCollection.updateOne(
      { _id: new ObjectId(blogId) },
      { $set: updatedFields }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Blog je uspijesno azuriran" });
    } else {
      res.status(404).json({ error: "Blog nije pronaden" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Brisanje objave:
app.delete("/kolekcija/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Netocan blog ID" });
    }

    const result = await postsCollection.deleteOne({ _id: new ObjectId(blogId) });

    if (result.deletedCount === 1) {
      res.json({ message: "Blog je uspijesno izbrisan" });
    } else {
      res.status(404).json({ error: "Blog nije pronaden" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Registracija novog korisnika:
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


// Prijava korisnika:
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

    const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Odjava korisnika:
app.get('/logout', (req, res) => {
  res.redirect('/login');
});


app.post('/like/:id', (req, res) => {
  const postId = req.params.id;
  postsCollection.updateOne({ _id: new ObjectId(postId) }, { $inc: { likes: 1 } }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Post liked');
  });
});


app.post('/dislike/:id', (req, res) => {
  const postId = req.params.id;
  postsCollection.updateOne({ _id: new ObjectId(postId) }, { $inc: { dislikes: 1 } }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Post disliked');
  });
});


// Komentiranje
app.patch('/kolekcija/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;

    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Netocan blog ID" });
    }

    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { comment: comment } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Komentar uspijesno dodan" });
    } else {
      res.status(404).json({ error: "Blog nije pronaden" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Pokušaj rada sa middleware-om
app.use(requestTime);

app.get('/time', (req, res) => {
    let responseText = 'Hello World!<br>'
    responseText += `<small>Requested at: ${req.requestTime}</small>`
    res.send(responseText)
})
app.listen(port, () => console.log(`Slušam na portu: ${port}`));
/* Podaci za BODY Postman-a
{
    "email": "marko@google.com",
    "password": "$2b$10$kFREqjiTAW/2I0oxkg.MDOnFnwA6B7NBV2sGGyV.XjM7KkLpNyMhu"
}

test prijave:
mario@google.com
mariomario
*/