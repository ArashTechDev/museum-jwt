const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

dotenv.config();
const userService = require("./user-service.js");
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
   

const HTTP_PORT = process.env.PORT || 8080;




app.use(cors());


let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
};

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload recieved', jwt_payload);

    if (jwt_payload) {
        next(null, {
            _id: jwt_payload._id,
            userName: jwt_payload.userName
        });
    } else {
        next(null, false);
    }
});

passport.use(strategy);
app.use(passport.initialize());

userService.connect()
    .then(() => {
        console.log('Connected to the database');

        // Start the server after the database connection is established
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error: ', err);
    });

app.post("/api/user/register", (req, res) => {
    console.log("Registering user with data: ", req.body);
    userService.registerUser(req.body)
    .then((msg) => {
        res.json({ "message": msg });
    }).catch((msg) => {
        console.error("Error registering user: ", msg);
        res.status(422).json({ "message": msg });
    });
});

app.post("/api/user/login", (req, res) => {
    userService.checkUser(req.body)
        .then((user) => {
            const payload = { _id: user._id, userName: user.userName };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
            res.json({ "message": "login successful", "token": token });
        }).catch(msg => {
            res.status(422).json({ "message": msg });
        });
});
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getFavourites(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }),(req, res) => {
    userService.addFavourite(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }),(req, res) => {
    userService.removeFavourite(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.get("/api/user/history", passport.authenticate('jwt', { session: false }),(req, res) => {
    userService.getHistory(req.user._id)
    .then(data => {
        res.json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })

});

app.put("/api/user/history/:id",passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addHistory(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }),(req, res) => {
    userService.removeHistory(req.user._id, req.params.id)
    .then(data => {
        res.json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

userService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});