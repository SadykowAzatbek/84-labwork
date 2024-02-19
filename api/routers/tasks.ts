import {Router} from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import auth, {RequestWithUser} from "../middleware/auth";

const tasksRouter = Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {

    const task = new Task({
      user: req.body.user,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

    await task.save();
    return res.send(task);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(err);
    }

    next(err);
  }
});

export default tasksRouter;
