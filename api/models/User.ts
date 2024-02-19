import {randomUUID} from "crypto";
import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';
import {UserMethods, UserModel, UserTypes} from "../types";

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<UserTypes, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

UserSchema.pre('save',async function (next) {
  if(!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret, options) => {
    delete ret.password;
    return ret;
  },
});

const User = model<UserTypes, UserModel>('User', UserSchema);

export default User;