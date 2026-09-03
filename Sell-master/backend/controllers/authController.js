import {
  registerUserService,
  loginUserService,
} from "../services/authService.js";

export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email, and password are required",
      });
    }

    const user = await registerUserService({
      name,
      email,
      password,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const user = await loginUserService({
      email,
      password,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
