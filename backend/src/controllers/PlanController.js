// controllers/planController.js
const mongoose = require("mongoose");
const Plan = require("../model/Plan");

//GetAll new plans
const getAllPlan = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true }).sort({ price: 1 });

        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to retrieve plans",
            error: error.message,
        });
    }
}


const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findOne({
            _id: req.params.id, isActive: true,
        });

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: plan,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
        }
    }
}



const updatePlan = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "price",
            "billingInterval",
            "features",
            "isActive",
        ];

        const updates = {};

        allowedFields.forEach((field) => {

            if (req.body[field] !== undefined) {

                updates[field] = req.body[field];
            }
        });

        const plan = await Plan.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        },
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: plan,
        });
    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A plan with this name already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update plan",
            error: error.message,
        });
    }
};


//creating new plan
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



const deactivatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: false },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Plan deactivated successfully",
            data: plan,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to deactivate plan",
            error: error.message,
        });
    }
};

module.exports = { createPlan, getAllPlan, getPlanById, updatePlan, deactivatePlan };