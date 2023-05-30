//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function main() {

  // connect to server
  await mongoose.connect(process.env.MONGO_URI + 'blogsdb')
    .then(() => app.listen(PORT, () => console.log('Server connection established😗')))
    .catch((err) => console.log("Server connection error🥲\n" + err));

  // postsSchema & Post model
  const postsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
  });
  const Post = new mongoose.model("Post", postsSchema);

  // infosSchema & Info model
  const infosSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String, required: true }
  });
  const Info = new mongoose.model("Info", infosSchema);

  // insert defaultInfos
  const foundInfos = await Info.find()
    .catch(err => console.log("Infos not found🫥\n" + err));
  if (foundInfos.length === 0) {
    const defaultInfos = [
      {
        heading: "Home",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        heading: "About",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        heading: "Contact",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      }
    ];
    await Info.insertMany(defaultInfos)
      .then(() => console.log("defaultInfos inserted succesfully🐥"))
      .catch(err => console.log("Error inserting defaultInfos😖\n" + err));
  }

  // home route
  app.get("/", async (req, res) => {
    const starting = await Info.findOne({ heading: "Home" });
    const posts = await Post.find()
      .catch(err => console.log("Error fetching posts😖\n" + err));
    res.render("home", {
      starting: starting,
      posts: posts
    });
  });

  // about route, contact route
  app.get("/about", async (req, res) => {
    const about = await Info.findOne({ heading: "About" })
      .catch(err => console.log("Error fetching About😞\n" + err));
    res.render("about", { about: about });
  });
  app.get("/contact", async (req, res) => {
    const contact = await Info.findOne({ heading: "Contact" })
      .catch(err => console.log("Error fetching Contact😖\n" + err));
    res.render("contact", { contact: contact });
  });

  // compose route get
  app.get("/compose", async (req, res) => {
    res.render("compose");
  });

  // compose route post
  app.post("/compose", async (req, res) => {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    await post.save()
      .then(() => console.log("Post saved😉"))
      .catch(err => console.log("Error saving the post🥺"));
    res.redirect("/");
  });

  // post
  app.get("/posts/:postName", async (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName);
    // console.log(requestedTitle + " :\n");
    const posts = await Post.find()
      .catch(err => console.log("Error fetching posts😖\n" + err));
    posts.forEach(async (post) => {
      const storedTitle = _.lowerCase(post.title);
      // console.log("\n\t" + storedTitle)
      if (storedTitle === requestedTitle) {
        res.render("post", {
          post: post
        });
      }
    });

  });

}

main().catch(err => console.log("unsuccessful🫠\n" + err));







































