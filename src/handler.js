const { create, getUsers, getUserById, updateUser, deleteUsers, getUserByEmail } = require("./service");
const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const { sign } = require("jsonwebtoken");
//const bcrypt = require("bcrypt");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
       // const hashedPass = await bcrypt.hash(req.body.password, 10);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if (err) {
                console.log(err);
                return false;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "failed to update user"
                });
            }
            return res.json({
                success: 1,
                message: "Updated Successfully"
            });
        });
    },
    deleteUsers: (req, res) => {
        const data = req.body;
        deleteUsers(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success: 1,
                message: "User Deleted Successfully"
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results}, "qwe1234", {
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
        });
    }
};