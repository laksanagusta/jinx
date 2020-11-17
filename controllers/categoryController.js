const Category = require('../models/Category')

module.exports = {
    addCategory: async (req, res) => {
        try {
            const {name} = req.body;
            await Category.create({name});
            req.flash('alertMessage', 'Success Add Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');
        }
    },
    editCategory: async (req, res) => {
        try {
            const {name, id} = req.body;
            const category = await Category.findOne({_id:id});
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category');            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');            
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const {id} = req.params;
            const category = await Category.findOne({ _id : id});
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category') 
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category');            
        }
    },
}