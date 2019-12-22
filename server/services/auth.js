const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const register = async data => {
  try {
    const {
      message,
      isValid
    } = validateRegisterInput(data);

    if (!isValid) {
      throw new Error(message);
    }

    const {
      name,
      email,
      owner,
      password
    } = data;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      throw new Error("This user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        owner,
        password: hashedPassword
      },
      err => {
        if (err) throw err;
      }
    );

    user.save();

    const token = jwt.sign({
      id: user._id
    }, keys.secretOrKey);

    return {
      token,
      loggedIn: true,
      ...user._doc,
      password: null
    };
  } catch (err) {
    throw err;
  }
};

const logout = async data => {
  const { _id } = data;

  const currentUser = await User.findById(_id);

  if (!currentUser) {
    throw new Error("Current user doesn't exist");
  };

  currentUser.token = "";
  currentUser.loggedIn = false;

  currentUser.save();

  return {
    token: "",
    loggedIn: false,
    ...currentUser._doc,
    password: null
  };
};

const login = async data => {
    
  try {
    const {
      message,
      isValid
    } = validateLoginInput(data);

    if (!isValid) {
      throw new Error(message);
    }
  } catch (err) {
    throw err;
  }

  const {
    email,
    password
  } = data

  const currentUser = await User.findOne({
    email
  });

  if (!currentUser) {
    throw new Error("User does not exist");
  };

  const validPassword = await bcrypt.compareSync(password, currentUser.password)
  
  if (!validPassword) {
    throw new Error("invalid credentials");
  };

  const token = jwt.sign({
    id: currentUser._id
  }, keys.secretOrKey);

  return {
    token,
    loggedIn: true,
    ...currentUser._doc,
    password: null
  };
};

const verifyUser = async data => {
  try {
    const {
      token
    } = data;
    const decoded = jwt.verify(token, keys.secretOrKey);
    const {
      id
    } = decoded;
    const user = await User.findById(id);
    let loggedIn;
    loggedIn = user ? true : false;

    return {
      loggedIn,
      ...user._doc
    };
  } catch (err) {
    return {
      loggedIn: false
    };
  }
};

module.exports = {
  register,
  logout,
  login,
  verifyUser
};