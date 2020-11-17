const Product = require('../models/Product')
const Image = require('../models/Image')
const fs = require('fs-extra')
const path = require('path')
const Category = require('../models/Category')
const Feature = require('../models/Feature')

module.exports = {
    addFeature: async (req, res) => {
        try {
            const {name, productId} = req.body;
            if(!req.file)
            {
                req.flash('alertMessage', 'Success Add Feature')
                req.flash('alertStatus', 'success')
                res.redirect(`/product/show-detail-product/${productId}`);
            }

            const feature = await Feature.create({
                name,
                productId,
                imageUrl: `images/${req.file.filename}`
            })

            const product = await Product.findOne({_id:productId})
            product.featureId.push({ _id:feature._id})
            await product.save()

            req.flash('alertMessage', 'Success Add Feature')
            req.flash('alertStatus', 'success')
            res.redirect(`/product/show-detail-product/${productId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/product/show-detail-product/${productId}`);
        }
    },
    editFeature: async (req, res) => {
        try {
          const { id, name, productId } = req.body;
          const feature = await Feature.findOne({ _id: id });
          if (req.file == undefined) {
            feature.name = name;
            await feature.save();
            req.flash('alertMessage', 'Success Update Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/product/show-detail-product/${productId}`);
          } else {
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            feature.name = name;
            feature.imageUrl = `images/${req.file.filename}`
            await feature.save();
            req.flash('alertMessage', 'Success Update Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/product/show-detail-product/${productId}`);
          }
        } catch (error) {
          req.flash('alertMessage', `${error.message}`);
          req.flash('alertStatus', 'danger');
          res.redirect(`/product/show-detail-product/${productId}`);
        }
      },
}