var router = require('express').Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload article objects on routes with ':article'
router.param('post', function(req, res, next, id) {
  Post.findOne({ id: _id})
    .populate('author')
    .then(function (post) {
      if (!post) { return res.sendStatus(404); }

      req.post = post;

      return next();
    }).catch(next);
});

router.param('comment', function(req, res, next, id) {
  Comment.findById(id).then(function(comment){
    if(!comment) { return res.sendStatus(404); }

    req.comment = comment;

    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next) {
  Post.find({})
    .then(function(results){
      console.log("Results: ", results);
      var posts = results;
      // var postsCount = results[1];
      // var user = results[2];

      return res.json({
        posts
      });
    })
  .catch(next);
});


  // var query = {};
  // var limit = 20;
  // var offset = 0;

  // if(typeof req.query.limit !== 'undefined'){
  //   limit = req.query.limit;
  // }

  // if(typeof req.query.offset !== 'undefined'){
  //   offset = req.query.offset;
  // }

  // // if( typeof req.query.tag !== 'undefined' ){
  // //   query.tagList = {"$in" : [req.query.tag]};
  // // }

  // Promise.all([
  //   req.query.author ? User.findOne({username: req.query.author}) : null
  // ]).then(function(results){
  //   var author = results[0];
  //   console.log(results, "promise.all BE Get");

  //   if(author){
  //     query.author = author._id;
  //   }

  //   // if(favoriter){
  //   //   query._id = {$in: favoriter.favorites};
  //   // } else if(req.query.favorited){
  //   //   query._id = {$in: []};
  //   // }

  //   return Promise.all([
  //     Post.find(query)
  //       .limit(Number(limit))
  //       .skip(Number(offset))
  //       .sort({createdAt: 'desc'})
  //       .populate('author')
  //       .exec(),
  //     Post.count(query).exec(),
  //     req.payload ? User.findById(req.payload.id) : null,
  //   ]).then(function(results){
  //     var posts = results[0];
  //     var postsCount = results[1];
  //     var user = results[2];

  //     return res.json({
  //       posts: posts.map(function(post){
  //         return post.toJSONFor(user);
  //       }),
  //       postsCount: postsCount
  //     });
  //   });
  // }).catch(next);
// });

// router.get('/feed', auth.required, function(req, res, next) {
//   var limit = 20;
//   var offset = 0;

//   if(typeof req.query.limit !== 'undefined'){
//     limit = req.query.limit;
//   }

//   if(typeof req.query.offset !== 'undefined'){
//     offset = req.query.offset;
//   }

//   User.findById(req.payload.id).then(function(user){
//     if (!user) { return res.sendStatus(401); }

//     Promise.all([
//       Post.find({ author: {$in: user.following}})
//         .limit(Number(limit))
//         .skip(Number(offset))
//         .populate('author')
//         .exec(),
//       Article.count({ author: {$in: user.following}})
//     ]).then(function(results){
//       var articles = results[0];
//       var articlesCount = results[1];

//       return res.json({
//         articles: articles.map(function(article){
//           return article.toJSONFor(user);
//         }),
//         articlesCount: articlesCount
//       });
//     }).catch(next);
//   });
// });

router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var post = new Post(req.body.post);

    post.author = user;

    return post.save().then(function(){
      console.log(post.author);
      return res.json({post: post.toJSONFor(user)});
    });
  }).catch(next);
});

// return a post
router.get('/:post', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.post.populate('author').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({post: req.post.toJSONFor(user)});
  }).catch(next);
});

// update article
router.put('/:post', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.post.author._id.toString() === req.payload.id.toString()){
      // if(typeof req.body.post.title !== 'undefined'){
      //   req.post.title = req.body.post.title;
      // }

      // if(typeof req.body.post.description !== 'undefined'){
      //   req.post.description = req.body.post.description;
      // }

      if(typeof req.body.post.body !== 'undefined'){
        req.post.body = req.body.post.body;
      }

      // if(typeof req.body.post.tagList !== 'undefined'){
      //   req.post.tagList = req.body.post.tagList
      // }

      req.post.save().then(function(post){
        return res.json({post: post.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete article
router.delete('/:post', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.post.author._id.toString() === req.payload.id.toString()){
      return req.post.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// return an article's comments
router.get('/:post/comments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.post.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(post) {
      return res.json({comments: req.post.comments.map(function(comment){
        return comment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

// create a new comment
router.post('/:post/comments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    var comment = new Comment(req.body.comment);
    comment.post = req.post;
    comment.author = user;

    return comment.save().then(function(){
      req.post.comments.push(comment);

      return req.post.save().then(function(post) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});

router.delete('/:post/comments/:comment', auth.required, function(req, res, next) {
  if(req.comment.author.toString() === req.payload.id.toString()){
    req.post.comments.remove(req.comment._id);
    req.post.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;