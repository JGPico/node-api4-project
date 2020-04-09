const express = require('express');

const router = express.Router();
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "Error adding user"});
  })
});

router.post('/:id/posts', validatePost, (req, res) => {
  //console.log(req.body);
  Users.insert(req.body)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    res.status(500),json({error: "Error adding post"});
  })
});

router.get('/', (req, res) => {
  Users.get()
  .then(userArray => {
    res.status(200).json(userArray);
  })
  .catch(err => {
    res.status(500).json({error: "Failed to get users"});
  });

});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json({error: "Failed to get user"})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    res.status(500).json({error: "Failed to get user posts"});
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json({message: "Successfully deleted user"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
  .then(user => {
    res.status(200).json({message: "Successfully updated user"});
  })
  .catch(err => {
    res.status(500).json({error: "Error editing user"});
  })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then(userBit => {
    if (userBit) {
      req.user = userBit;
      next();
    } else {
      res.status(400).json({error: "invalid user id"});
    }
  })
  .catch(err => {
    res.status(500).json({error: "Error fetching user"});
  })
  
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({error: "Missing user data"});
  } else if (!req.body.name) {
    res.status(400).json({error: "Missing required name field"});
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({error: "Missing post data"});
  } else if (!req.body.text) {
    res.status(400).json({error: "Missing required text field"});
  } else {
    next();
  }
}

module.exports = router;
