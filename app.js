const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const { urlencoded } = require("body-parser");
const _ = require("lodash"); //for getting parameters in the search box without any hypene for extra(see lodash documentation on lowercase function)
// ____________________________________________________________________________________________________________

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogDB");
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model("posts", postSchema);
// ____________________________________________________________________________________________________________
const homeContent =
  "This is just a Blog Website developed for practicing CRUD operations in javascript and using monoDB. It is a collection of daily Journal you are composing praesentium impedit maxime libero esse sint dolore nihil beatae, quaerat non perspiciatis accusamus fugiat odio, modi quidem aperiam numquam iste. Aut facere magni quam eos unde modi veniam, saepe labore.";
const aboutContent =
  "This is Gouri Shankar B.Tech Student CSE(Iot) at Crescent Institute of Science And Technology. I love to code and listen music. I am very big fan of The Weeknd music Artist. I love to travel alone. Very fond of reading philosphy books . Currently improving Web Dev skills to get into a product based company so that i can surrounded by good developers and learn with them. Learning is never enough....So enjoy learning..... :)";
const contactContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, nulla. Fuga, tempora odit? Quo nesciunt tenetur molestiae aut excepturi dignissimos praesentium impedit maxime libero esse sint dolore nihil beatae, quaerat non perspiciatis accusamus fugiat odio, modi quidem aperiam numquam iste. Aut facere magni quam eos unde modi veniam, saepe labore.";

const app = express();
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true })); //This line is used to parse the incoming request bodies in a middleware before the handlers, available under the req.body property. The option extended: true allows to use the more powerful qs library for parsing the data.
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find({}, (err, data) => {
    res.render("home", {
      heading: "Home",
      content: homeContent,
      allPosts: data,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { heading: "About", content: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { heading: "Contact", content: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose", { heading: "Compose", content: contactContent });
});
// _____________________________POST_________________________________
app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.t,
    content: req.body.p,
  });
  post.save();
  res.redirect("/");
});
// ______________________________________________________________

app.get("/posts/:page", (req, res) => {
  let path = _.lowerCase(req.params.page); //_.lowerCase('first-day') = first day
  Post.findOne({ title: path }, (err, data) => {
    res.render("post", {
      heading: data.title,
      content: data.content,
    });
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
