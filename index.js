import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // This should log the password
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configure dotenv to load environment variables from .env file

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();


app.get("/", async (req, res) => {
  try{
    const result = await db.query("select * from items order by id ASC");
  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows,
  });
  }
  catch(err){
    console.log(err);
  }
  
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  try{
    db.query("insert into items (title) values ($1) ", [item]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
  
});

app.post("/edit", (req, res) => {
const id = req.body["updatedItemId"];
const title = req.body["updatedItemTitle"];
try{
  db.query("update items set title = $1 whiere id = $2)",[title, id]);
  res.redirect("/");
}
catch(err){
  console.log(err);
}

});

app.post("/delete", (req, res) => {
  const id = req.body["deleteItemId"];
  console.log(id);
  try{
    db.query("delete from items where id = $1",[id]); 
  res.redirect("/");
  }
  catch(err)
{
  console.log(err);
}  

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
