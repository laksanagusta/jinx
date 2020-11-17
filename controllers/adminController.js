const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Product = require("../models/Product");
const User = require("../models/User");
const Member = require('../models/Member')
const Booking = require('../models/Booking')
const bycrypt = require("bcryptjs");
const fs = require('fs-extra')
const path = require('path')


module.exports = {
    viewDashboard: (req, res) => {
        try {
            res.render('admin/dashboard/v_dashboard', {
                title: "Jinx",
                user: req.session.user
            });            
        } catch (error) {
            
        }
    },
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status : alertStatus};
            res.render('admin/category/v_category', { 
                category ,
                alert,
                title: "Jinx",
                user: req.session.user
            });
        } catch (error) {
            res.redirect('/admin/category');
            
        }
    },
    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status : alertStatus};
            res.render('admin/bank/v_bank', { 
                bank,
                alert,
                title: "Jinx",
                user: req.session.user
            });
        } catch (error) {
            res.redirect('/admin/bank');
            
        }
    },
    viewProduct: async (req, res) => {
        const product = await Product.find()
                        .populate({path:'imageId', select: 'id imageUrl'})
                        .populate({path:'categoryId', select: 'id name'})
        const category = await Category.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {message: alertMessage, status : alertStatus};
        res.render('admin/product/v_product', {
            title: "Jinx",
            category,
            alert,
            product,
            action: 'view',
            user: req.session.user
        });
    },
    viewBooking: async (req, res) => {
        try {
            const Booking = await Booking.find()
            .populate('memberId')
            .populate('bankId')            
        } catch (error) {
            
        }
        res.render('admin/booking/v_booking', {
            title: "Jinx",
            user: req.session.user
        });
    },
    viewSignIn: async (req, res) => {
        try {
            if(req.session.user == null || req.session.user == undefined)
            {
                const alertMessage = req.flash('alertMessage');
                const alertStatus = req.flash('alertStatus');
                const alert = {message: alertMessage, status : alertStatus};
                res.render('index', {
                    alert,
                    title: "Jinx",
                    user: req.session.user
                });
            }else{
                res.redirect('/admin/dashboard')
            }
        } catch (error) {
            res.redirect('/admin/signin');
            
        }
    },
    viewSignUp: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status : alertStatus};
            res.render('signup', {
                alert,
                title: "Jinx",
                user: req.session.user
            });
        } catch (error) {
            res.redirect('/admin/signup');
        }
    },
    signIn: async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username:username})
            const isPasswordMatch = await bycrypt.compare(password, user.password);

            if(user){
                if(isPasswordMatch)
                {
                    req.session.user = {
                        id:user.id,
                        name:user.name,
                        username:user.username
                    }
                    res.redirect('/admin/dashboard');
                }
                else{
                    req.flash('alertMessage', 'Password dosesnt match');
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/signin');
                }
            }
            else{
                req.flash('alertMessage', 'Username not found in any records');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }            
        } catch (error) {
            req.flash('alertMessage', 'Username not found in any records');
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/signin');
        }
    },
    signUp: async (req, res) => {
        try {
            const {username, password, name} = req.body;
            const user = await User.create({
                name: name,
                username: username,
                password: password
            })
            user.save()
            req.session.user = {
                id:user.id,
                name:user.name,
                username:user.username
            }
            res.redirect('/admin/dashboard');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/signup');
        }
    },
    logout: async(req, res) => {
        req.session.destroy();
        res.redirect('/admin/signin')
    }
}