const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Member = require('./models/member.model');
const User = require('./models/login.model');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());


app.use(express.json());


app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
 });

// Membuat koneksi ke MongoDB Atlas
const uri = 'mongodb+srv://faeznz:faeznz@data.h3xudui.mongodb.net/?retryWrites=true&w=majority';
// const uri = 'mongodb://127.0.0.1:27017/datamember';
// const uri = 'mongodb://0.0.0.0:27017/datamember';
mongoose.set('strictQuery', true);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Failed to connect to MongoDB', error);
  });


// Mengatur rute untuk mengambil data member
app.get('/members', (req, res) => {
  Member.find()
    .then(members => {
      res.json(members);
    })
    .catch(error => {
      console.log('Failed to fetch members', error);
      res.status(500).json({ error: 'Failed to fetch members' });
    });
});

app.post('/members', (req, res) => {
  const newMember = new Member({
    nik: req.body.nik,
    nama: req.body.nama,
    alamat: req.body.alamat,
    noHp: req.body.noHp,
    email: req.body.email,
    instagram: req.body.instagram,
    tanggalKadaluarsa: req.body.tanggalKadaluarsa,
    jenisMember: req.body.jenisMember
  });

  newMember.save()
    .then(() => {
      res.status(201).json({ message: 'Member added successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to add member' });
    });
});

// Mendapatkan detail member berdasarkan ID
app.get('/members/:id', (req, res) => {
  const memberId = req.params.id;
  Member.findById(memberId)
    .then(member => {
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json(member);
    })
    .catch(error => {
      console.log('Failed to fetch member', error);
      res.status(500).json({ error: 'Failed to fetch member' });
    });
});

// Mengupdate data member berdasarkan ID
app.put('/members/:id', (req, res) => {
  const memberId = req.params.id;
  Member.findByIdAndUpdate(memberId, req.body)
    .then(() => {
      res.status(200).json({ message: 'Member updated successfully' });
    })
    .catch(error => {
      console.log('Failed to update member', error);
      res.status(500).json({ error: 'Failed to update member' });
    });
});

// Menghapus member berdasarkan ID
app.delete('/members/:id', (req, res) => {
  const memberId = req.params.id;
  Member.findByIdAndRemove(memberId)
    .then(() => {
      res.status(200).json({ message: 'Member deleted successfully' });
    })
    .catch(error => {
      console.log('Failed to delete member', error);
      res.status(500).json({ error: 'Failed to delete member' });
    });
});

// LOGIN CODE

// Middleware untuk pengaturan Passport.js
app.use(passport.initialize());

// Konfigurasi Passport.js untuk strategi autentikasi lokal
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, done) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }
          bcrypt.compare(password, user.password)
            .then((result) => {
              if (!result) {
                return done(null, false, { message: 'Incorrect password' });
              }
              return done(null, user);
            })
            .catch((error) => done(error));
        })
        .catch((error) => done(error));
    }
  )
);

// Konfigurasi Passport.js untuk strategi JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret_key' 
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((error) => done(error, false));
  })
);



// Mengizinkan Express untuk membaca data dari body dalam format JSON
app.use(express.json());

// Endpoint untuk membuat pengguna baru
app.post('/users', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({ username, password: hashedPassword });
      user.save()
        .then(() => {
          res.status(201).json({ message: 'User created successfully' });
        })
        .catch((error) => {
          console.error('Failed to save user', error);
          res.status(500).json({ error: 'Failed to save user' });
        });
    })
    .catch((error) => {
      console.error('Failed to hash password', error);
      res.status(500).json({ error: 'Failed to hash password' });
    });
});


// Endpoint untuk login dan mendapatkan token JWT
app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error) {
      console.error('Authentication error', error);
      res.status(500).json({ error: 'Authentication error' });
    } else if (!user) {
      res.status(401).json({ error: info.message });
    } else {
      const payload = { sub: user._id };
      const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '1h' });
      res.json({ token });
    }
  })(req, res, next);
});

// Endpoint yang memerlukan autentikasi (contoh)
app.get('/membrs', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You have accessed the protected profile route' });
});

 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
