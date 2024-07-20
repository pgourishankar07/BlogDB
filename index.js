require("dotenv").config();
const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const { urlencoded } = require("body-parser");
const _ = require("lodash"); //for getting parameters in the search box without any hypene for extra(see lodash documentation on lowercase function)
// ____________________________________________________________________________________________________________

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://pgourishankar04:${process.env.PASSWD}@cluster0.shn3qtn.mongodb.net/blogDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model("posts", postSchema);
// ____________________________________________________________________________________________________________
const homeContent =
  "Welcome to our blog all about databases to read about daily blogs and you can also compose yours daily journal on this blog site.This is just a Blog Website developed for practicing CRUD operations in javascript and using mongoDB. It is a collection of daily Journal you are composing Here you'll find expert insights, tips, and news on everything related to databases - from the latest technology trends to best practices for managing and optimizing your database. Our team of experienced writers and database professionals are passionate about sharing their knowledge and expertise with our readers.";
const aboutContent =
  "My name is Gouri Shankar, and I am a B.Tech student studying CSE (IoT) at Crescent Institute of Science and Technology. I love to code and listen to music, and I also enjoy traveling alone. I am very fond of reading philosophy books, and I am currently working on improving my web development skills to secure a position in a product-based company where I can be surrounded by good developers and learn from them. Learning is never enough, so I always strive to enjoy learning. :)";
const contactContent =
  "Thank you for your interest in our blog all about daily journal! We love hearing from our readers/users and welcome your feedback, comments, and questions. Whether you have a suggestion for a topic you'd like us to cover, or you simply want to say hello, we'd love to hear from you.Thank you for being a part of our community and we look forward to hearing from you!";

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
    title: _.lowerCase(req.body.t),
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
      heading: _.capitalize(data.title),
      content: data.content,
    });
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
