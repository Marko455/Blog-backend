import express from "express";
import cors from "cors";
import storage from "./memory_storage.js";
const app = express();
const port = 3000;
const router = express.Router();

app.use(express.json());
app.use("/api", router);
app.use(cors());

router.get("/posts", (req, res) => {
    res.json(storage);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});