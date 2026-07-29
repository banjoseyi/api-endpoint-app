// controllers/planController.js
const mongoose = require("mongoose");
const Plan = require("../model/Plan");


const getAllPlan = async (req, res) => {
    try {

    } catch (error) {

    }
}

const createPlan = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            billingInterval,
            features,
        } = req.body;

        if (!name || !description || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name, description and price are required",
            });
        }

        const existingPlan = await Plan.findOne({
            name: name.trim(),
        });

        if (existingPlan) {
            return res.status(409).json({
                success: false,
                message: "A plan with this name already exists",
            });
        }

        const plan = await Plan.create({
            name,
            description,
            price,
            billingInterval,
            features,
        });

        return res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: plan,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create plan",
            error: error.message,
        });
    }
};


module.exports = { createPlan, getAllPlan };