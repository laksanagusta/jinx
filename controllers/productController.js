const Product = require('../models/Product')
const Image = require('../models/Image')
const fs = require('fs-extra')
const path = require('path')
const Category = require('../models/Category')
const Feature = require('../models/Feature')

module.exports = {
    addProduct: async (req, res) => {
        try {
            const {title, price, about, brand, categoryId} = req.body;
            if(req.files.length > 0)
            {
                const category = await Category.findOne({ _id : categoryId})
                const newProduct = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price,
                    brand,
                }
                const product = await Product.create(newProduct)
                category.productId.push({_id : product._id})
                await category.save()
                for(let i=0; i < req.files.length; i++)
                {
                    const imageSave = await Image.create({imageUrl : `images/${req.files[i].filename}`})
                    product.imageId.push({_id:imageSave._id})
                    await product.save()
                }
            }
            req.flash('alertMessage', 'Success Add Product')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/product');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/product');
        }
    },
    showImageProduct: async (req, res) => {
        try {
          const { id } = req.params;
          const product = await Product.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' });
            
          const alertMessage = req.flash('alertMessage');
          const alertStatus = req.flash('alertStatus');
          const alert = { message: alertMessage, status: alertStatus };
          res.render('admin/product/v_product', {
            title: "Jinx",
            alert,
            product,
            action: 'show image',
            user: req.session.user,
          });
        } catch (error) {
          req.flash('alertMessage', `${error.message}`);
          req.flash('alertStatus', 'danger');
          res.redirect('/admin/product');
        }
    },

    showEditProduct: async (req, res) => {
        try {
          const { id } = req.params;
          const product = await Product.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl'})
            .populate({ path: 'categoryId', select: 'id name'});
        
          const category = await Category.find()

          const alertMessage = req.flash('alertMessage');
          const alertStatus = req.flash('alertStatus');
          const alert = { message: alertMessage, status: alertStatus };
          res.render('admin/product/v_product', {
            title: "Jinx",
            alert,
            product,
            action: 'edit',
            category,
            user: req.session.user,
          });
        } catch (error) {
          req.flash('alertMessage', `${error.message}`);
          req.flash('alertStatus', 'danger');
          res.redirect('/admin/product');
        }
    },

    editProduct: async (req, res) => {
      try {
        const { id } = req.params;
        const { title, brand, price, about, categoryId} = req.body;
        const product = await Product.findOne({ _id: id })
          .populate({ path: 'imageId', select: 'id imageUrl'})
          .populate({ path: 'categoryId', select: 'id name'});
    
        if(req.files.length > 0){
          for(let i=0; i < product.imageId.length; i++){
            const imageUpdate = await Image.findOne({ _id:product.imageId[i]._id})
            await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`))
            imageUpdate.imageUrl = `images/${req.files[i].filename}`
            await imageUpdate.save()
          }
          product.title = title;
          product.brand = brand;
          product.description = about;
          product.price = price;
          product.categoryId = categoryId;
          await product.save();
        } else {
          product.title = title;
          product.brand = brand;
          product.description = about;
          product.price = price;
          product.categoryId = categoryId;
          await product.save();
        }
        req.flash('alertMessage', 'Success Edit Product')
        req.flash('alertStatus', 'success')
        res.redirect('/admin/product');
      } catch (error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/product');
      }
  },
  deleteProduct: async (req, res) => {
      try {
          const { id } = req.params;
          const product = await Product.findOne({ _id: id })
            .populate('imageId')
          for(let i=0; i<product.imageId.length; i++)
          {
            Image.findOne({_id:product.imageId[i]._id}).then(async (image) =>  {
              await fs.unlink(path.join(`public/${image.imageUrl}`))
              image.remove()

            }).catch((err) => {
              req.flash('alertMessage', `${error.message}`)
              req.flash('alertStatus', 'danger')
              res.redirect('/admin/product');     
            })
          }
          await product.remove();
          req.flash('alertMessage', 'Success Delete Product')
          req.flash('alertStatus', 'success')
          res.redirect('/admin/category') 
      } catch (error) {
          req.flash('alertMessage', `${error.message}`)
          req.flash('alertStatus', 'danger')
          res.redirect('/admin/product');            
      }
  },
  productDetail: async (req, res) => {
      try {
          const { productId } = req.params;
          const alertMessage = req.flash('alertMessage');
          const alertStatus = req.flash('alertStatus');
          const alert = {message: alertMessage, status : alertStatus};
          const feature = await Feature.find({productId:productId})
          res.render('admin/product/productDetail/v_detail_product', {
            title: "Jinx",
            alert,
            productId,
            feature,
            user: req.session.user
        });
      } catch (error) {
          req.flash('alertMessage', `${error.message}`)
          req.flash('alertStatus', 'danger')
          res.redirect(`/admin/product/show-detail-product/${productId}`);            
      }
  },
}