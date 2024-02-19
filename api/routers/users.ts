import {Router} from "express";
import mongoose, {mongo} from "mongoose";
import User from "../models/User";

const usersRouter = Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(err);
    }

    if (err instanceof mongo.MongoServerError && err.code === 11000) {
      return res.status(422).send({message: 'Username should be unique'});
    }

    next(err);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if(!user) {
      return res.status(422).send({error: 'Username and/or password not found!'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if(!isMatch) {
      return res.status(422).send({error: 'Username and/or password not found!'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password are correct!', user});
  } catch (err) {
    next(err);
  }
});

export default usersRouter;