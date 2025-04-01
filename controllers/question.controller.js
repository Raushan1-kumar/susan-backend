const questionService = require("../services/ai.questionChecker.serivce.js");
const { validationResult } = require("express-validator");
const { authUser } = require("../middlewares/auth.middlewares.js");
const hintService = require("../services/ai.hint.service.js");
const puzzleService = require("../services/puzzle.service.js");
const hintModel = require("../models/hint.model.js");
const interviewService = require("../services/interview.services.js");

module.exports.checkQuestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const code = req.body.code;
    if (!code) {
      res.status(400).json({
        msg: "code is required",
      });
    }
    const response = await questionService.generateResult(code);
    if (!response) {
      res.status(400).json({
        msg: "respond not generated",
      });
    }
    console.log(response);
    res.status(200).json({
      msg: "respond generated",
      text: response.text,
      code: response.optimizedCode,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.giveHint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const question = req.body.question;
    if (!question) {
      res.status(400).json({
        msg: "question is required",
      });
    }
    const response = await hintService.giveHint(question);
    if (!response) {
      res.status(400).json({
        msg: "respond not generated",
      });
    }
    res.status(200).json({
      msg: "respond generated",
      text: response.text,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.puzzle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const puzzle = req.body.puzzle;
    console.log(puzzle);
    console.log("i have reached here");
    if (!puzzle) {
      res.status(400).json({
        msg: "puzzle is required",
      });
    }
    const response = await puzzleService.puzzle(puzzle);
    if (!response) {
      res.status(400).json({
        msg: "respond not generated",
      });
    }
    res.status(200).json({
      msg: "respond generated",
      text: response.text,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.checkIsHintPresent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      res.status(400).json({
        msg: "prompt is required",
      });
    }
    const response = await puzzleService.puzzle(puzzle);
    if (!response) {
      res.status(400).json({
        msg: "respond not generated",
      });
    }
    res.status(200).json({
      msg: "respond generated",
      text: response.text,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.virtualInvterview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const {question, answer}= req.body;
    console.log("i have reached here");
    if (!question) {
      res.status(400).json({
        msg: "interviewQuestion is required",
      });
    }
    const response = await interviewService.interview({question, answer});
    if (!response) {
      res.status(400).json({
        msg: "respond not generated",
      });
    }
    res.status(200).json({
      msg: "respond generated",
      text: response,
    });
  } catch (err) {
    console.log(err);
  }
};
