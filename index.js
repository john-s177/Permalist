import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = await mysql.createConnection(
  {
    user: "root",
    host:"localhost",
    database: "permalist",
    password: "123456"
  }
);

app.get("/", async (req, res) => {
  try{
    const [rows] = await db.execute("select * from items order by id;")
    const items=rows;

    res.render("index.ejs",{
      listTitle:"To Do",
      listItems: items,
    })
  }
  catch (err){
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.execute("insert into items (title) values (?)",[item]);
  }
  catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try{
    await db.execute("update items set title = ? where id= ?",[item, id]);
  }
  catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.execute("delete from items where id = ?", [id]);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
