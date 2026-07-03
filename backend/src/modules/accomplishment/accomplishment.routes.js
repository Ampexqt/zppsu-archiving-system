const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const controller =
  require("./accomplishment.controller");

router.get(

  "/",

  authMiddleware,

  controller.getReport

);

module.exports =
  router;