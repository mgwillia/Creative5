// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

app.listen(3000, () => console.log('Server listening on port 3000!'));

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result) {
       let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
       });
      console.log(token);
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id},token:token});
    } else {
       res.status(403).send("Invalid credentials");
    }
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({email: req.body.email, hash: hash, username:req.body.username,
				 name:req.body.name, role: 'user'});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    let token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400
    });
    res.status(200).json({user:user,token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.get('/api/users/:id/heroes', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('heroes','users.id','heroes.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('heroName', 'heroDescription', 'heroClass', 'specialPower', 'attackPoints', 'defensePoints', 'magicPoints', 'username','name','created').then(heroes => {
      res.status(200).json({heroes:heroes});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/heroes', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  console.log(id);
  console.log(req.userID);
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  knex('users').where('id',id).first().then(user => {
    return knex('heroes').insert({user_id: id, heroName:req.body.heroName, heroDescription:req.body.heroDescription, heroClass:req.body.heroClass, specialPower:req.body.specialPower, attackPoints:req.body.attackPoints, defensePoints:req.body.defensePoints, magicPoints:req.body.magicPoints, created: new Date()});
  }).then(ids => {
    return knex('heroes').where('id',ids[0]).first();
  }).then(heroName => {
    res.status(200).json({heroName:heroName});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.get('/api/heroes/search', (req, res) => {
  if (!req.query.keywords)
    return res.status(400).send();
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);
  knex('users').join('heroes','users.id','heroes.user_id')
    .whereRaw("MATCH (heroDescription) AGAINST('" + req.query.keywords + "')")
    .orderBy('created','desc')
    .limit(limit)
    .offset(offset)
    .select('heroName','heroDescription','heroClass','specialPower','attackPoints','defensePoints','magicPoints','username','name','created','users.id as userID').then(heroes => {
      res.status(200).json({heroes:heroes});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.get('/api/users/:id', (req, res) => {
  let id = parseInt(req.params.id);
  // get user record
  knex('users').where('id',id).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});

// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  knex('users').where('id',req.userID).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});

app.delete('/api/users/:id/delete/:hero', (req,res) => {
  // id of the person who owns the hero
  let id = parseInt(req.params.id);
  // id of the hero
  let thisHero = parseInt(req.params.hero);
  // make sure both of these users exist
  knex('users').where('id',id).first().then(user => {
    return knex('heroes').where('id',thisHero).first();
  }).then(user => {
    // delete the entry in the heroes table
    return knex('heroes').where({'id':thisHero}).first().del();
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
