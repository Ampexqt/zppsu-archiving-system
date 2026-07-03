const express =
  require("express");

const router =
  express.Router();

const inventoryController =
  require("./inventory.controller");

// CREATE INVENTORY
router.post(
  "/create",
  inventoryController.createInventory
);

// GET INVENTORY
router.get(
  "/",
  inventoryController.getInventories
);

// DELETE INVENTORY
router.delete(
  "/:id",
  inventoryController.deleteInventory
);

module.exports = router;