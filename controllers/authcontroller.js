import mongoose from "mongoose";
export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startRegister();
}

export const login = async (req, res, next) => {}

export const logout = async (req, res, next) => {}

export const courses = async (req, res, next) => {}

export const grades  = async (req, res, next) => {}

