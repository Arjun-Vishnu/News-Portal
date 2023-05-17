const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let Article = require('../models/article');

router.get('/add', function(req, res){
    res.render('add', {
        title: 'Add Article'
    })
});

router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit',{
            title: "Edit",
            article: article
        })
    })
});

router.post('/add', function(req, res){
  let article = new Article();

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
      if(err) {
          console.log(err);
          return;
      } else {
          res.redirect('/');
      }
  });
});


router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
    Article.update(query, article, function(err){
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated')
            res.redirect('/');
        }
    });
});

router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article: article
        });
    });
});

router.get('/delete/:id', function (req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = {
    _id: req.params.id
  };
  Article.deleteOne(query, article)
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

module.exports = router;