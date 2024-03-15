import { MongoClient } from "mongodb";
const connectionString =
	"mongodb+srv://Marko:mg14012003@cluster0.ppm8yic.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);
let conn = null;
try {
	console.log("Trying to establish connection...");
	conn = await client.connect();
//	console.log(conn);
} catch (e) {
	console.error(e);
}
debugger
let db = client.db("PostsProba");
export default db;