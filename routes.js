const express = require("express");

function routes(Movie, User) {
  const apiRouter = express.Router();

  /***User Routes***/
  apiRouter
    .route("/users")
    .post((req, res) => {
      // TODO: Bar creation of multiple accounts using same email
      const user = new User(req.body);
      user.save().catch((err) => {
        console.log(err);
      });
      return res.status(201).json(user);
    })
    .get((req, res) => {
      User.find((err, users) => {
        if (err) {
          return res.send(err);
        }
        return res.json(users);
      });
    });

  apiRouter.use("/user/:email", (req, res, next) => {
    User.find(
      {
        email: req.params.email,
      },
      (err, user) => {
        if (err) {
          return res.send(err);
        }
        if (user) {
          req.user = user;
          return next();
        }
        return res.sendStatus(404);
      }
    );
  });
  //TODO: to be changed to username or email or third party verification
  //TODO: put and patch methods failing at save

  apiRouter
    .route("/user/:email")
    .get((req, res) => res.json(req.user))
    .put((req, res) => {
      User.findOneAndReplace(
        {
          email: req.params.email,
        },
        req.user,
        (err, user) => {
          if (err) {
            return res.send(err);
          }
          return res.json(user);
        }
      );
    })
    .patch((req, res) => {
      User.findOneAndUpdate(
        {
          email: req.params.email,
        },
        req.body,
        { new: true }
      )
        .then((_newUser) => {
          return _newUser ? res.json(_newUser) : res.sendStatus(404);
        })
        .catch((err) => res.send(err));
    })
    .delete((req, res) => {
      User.findOneAndDelete({
        email: req.params.email,
      })
        .then((deletedUser) =>
          // TODO: throw error for request to delete none-existent account
          res.send(`Deletion Of ${deletedUser.email} Account Successfull: `)
        )
        .catch((err) => res.send(err));
    });

  /*********AUTHENTICATION*********/
  

  /***Movie Routes***/
  apiRouter
    .route("/movies")
    .post((req, res) => {
      const movie = new Movie(req.body);
      movie.save().catch((err) => {
        console.log(err);
      });
      return res.status(201).json(movie);
    })
    .get((req, res) => {
      Movie.find((err, movies) => {
        if (err) {
          return res.send(err);
        }
        const returnMovies = movies.map((movie) => {
          let newMovie = movie.toJSON();
          newMovie.links = {};
          const title = movie.title.split(" ").join("%20");
          newMovie.links.self = `http://${req.headers.host}/api/movie/${title}`;
          return newMovie;
        });
        return res.json(returnMovies);
      });
    });

  apiRouter.route("/movie/:title").get((req, res) => {
    Movie.find(
      {
        title: req.params.title,
      },
      (err, movies) => {
        if (err) {
          return res.send(err);
        }
        return res.json(movies);
      }
    );
  });
  /*get by genre*/
  apiRouter.route("/genre/:genre").get((req, res) => {
    Movie.find(
      {
        genre: req.params.genre,
      },
      (err, movies) => {
        if (err) {
          return res.send(err);
        }
        const retrunMovies = movies.map((movie) => {
          let newMovie = movie.toJSON();
          newMovie.links = {};
          const title = movie.title.split(" ").join("%20");
          newMovie.links.self = `http://${req.headers.host}/api/movie/${title}`;
          return newMovie;
        });
        return res.json(retrunMovies);
      }
    );
  });
  /*search*/
  apiRouter.route("/search/:searchTerm").get((req, res) => {
    const searchTerm = req.params.searchTerm;
    Movie.find(
      {
        title: /searchTerm/,
      },
      (err, movies) => {
        if (err) {
          return res.send(err);
        }
        const returnMovies = movies.map((movie) => {
          let newMovie = movie.toJSON();
          newMovie.links = {};
          const title = movie.title.split(" ").join("%20");
          newMovie.links.self = `http://${req.headers.host}/api/movie/${title}`;
          return newMovie;
        });
        return res.json(returnMovies);
        // res.send();
      }
    );
  });
  return apiRouter;
}

module.exports = routes;
