//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
main().catch(err => console.log(err));
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
  const articleSchema = new mongoose.Schema({
    title: String,
    content: String
  });
  const Article = new mongoose.model("Article", articleSchema);

  //////////Requests  Targetting all articles//////////

  app.route("/articles").get(function(req, res) {
      Article.find(function(err, foundArticles) {
        if (!err) {
          res.send(foundArticles);
        } else {
          res.send(err);
        }
      });
    })

    .post(function(req, res) {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
      });
      newArticle.save(function(err) {
        if (!err)
          res.send("Successfully added");
        else
          res.send(err);
      });
    })

    .delete(function(req, res) {
      Article.deleteMany(function(err) {
        if (!err) {
          res.send("Successfully deleted");
        } else {
          res.send(err);
        }
      });
    });

  //////////Requests  Targetting a specific articles//////////

  app.route("/articles/:articleTitle")


    .get(function(req, res) {
      Article.findOne({
        title: req.params.articleTitle
      }, function(err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article matching that title ");
        }
      })
    })
    .put(function(req, res) {
      Article.replaceOne({
          title: req.params.articleTitle
        }, //condition
        {
          title: req.body.title,
          content: req.body.content
        }, //update
        // {overwrite: true},
        function(err) {
          if (!err) {
            res.send("Successfully updates article.");
          }
        }
      );
    })
    .patch(function(req, res) {
        Article.updateOne(
          {title: req.params.articleTitle},
          {title:req.body.title, content: req.body.content},
          // {$set:req.body},
          function(err) {

          if(!err){
            res.send("successfully updated article");
          }else{
            res.send(err);
          }}
        )
    })
    .delete(function(req,res){
      Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
          if(!err){
            res.send("deleted");
          }else{
            res.send(err);
          }
        }
      )
    })



  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
}
