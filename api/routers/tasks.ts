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

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const tasks = await Task.find({user: req.user?._id});

    res.send(tasks);
  } catch (err) {
    next(err);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;

    const task = await Task.findOne({_id: taskId, user: userId});

    if (!task) {
      return res.status(403).send({error: `You don't have enough rights!!`});
    }

    if (req.body.title) {
      task.title = req.body.title;
    } else {
      return res.status(422).send({error: 'the title must not be empty!'});
    }

    if (req.body.description) {
      task.description = req.body.description;
    }

    if (req.body.status) {
      task.status = req.body.status;
    }

    await task.save();
    return res.send(task);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(err);
    }

    next(err);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;

    const task = await Task.findOne({_id: taskId, user: userId});

    if (!task) {
      return res.status(403).send({error: `You don't have enough rights!!`});
    }

    await Task.deleteOne({_id: taskId});

    res.send({message: 'Task deleted'});
  } catch (err) {
    next(err);
  }
});

export default tasksRouter;
