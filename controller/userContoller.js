const userModel = require("../models/userModel");
const Mailer = require("../helper/mailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
  // Register
  register = async (req, res) => {
    try {
      const { name, email, password, bio } = req.body;
      const profilePicture = req.file?.filename;

      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to database
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        bio,
        profilePicture,
        isDeleted: false,
        
      });

      await newUser.save();

      // Send registration successful email
      try {
        const mailer = new Mailer(
          "Gmail",
          process.env.APP_EMAIL,
          process.env.APP_PASSWORD
        );

        const mailObj = {
          to: email,
          subject: "Your New Account Details",
          text: `Hello ${name},\n\nYour account has been created.\n\nThank you!`,
        };

        await mailer.sendMail(mailObj);
      } catch (mailError) {
        console.error("Email Sending Failed:", mailError);
      }

      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  };

  // Signin
  signin = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
        });
      }

      const user = await userModel.findOne({ email, isDeleted: false });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      const payload = { id: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      if (req.session) {
        req.session.token = token;
      }

      req.user = user;

      res.status(200).json({
        success: true,
        message: "Signin successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      console.error("Signin Error:", err);
      res.status(500).json({
        success: false,
        message: "Signin failed",
        error: err.message,
      });
    }
  };





//////////////////////////////////////
  // Get user by ID
  getUserById = async (req, res) => {
    try {
      const id = req.params.id;

      const getUser = await userModel.findOne({ _id: id, isDeleted: false });

      if (getUser) {
        res.status(200).json({
          success: true,
          message: "User data fetched successfully",
          data: getUser,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Get User Error:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };



  
  // Update user data
 updateUserData = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, password, bio, profilePicture } = req.body;

    const existingUser = await userModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);
    if (bio) updatedFields.bio = bio;
    if (profilePicture) updatedFields.profilePicture = profilePicture;

    const updatedUser = await userModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

}

module.exports = new UserController();
