const Bank = require("../models/Bank");
const fs = require('fs-extra')
const path = require('path')

module.exports = {
  addBank: async (req, res) => {
      try {
          const {name, nameBank, accountNumber} = req.body;
          await Bank.create({
              name, 
              nameBank,
              accountNumber,
              imageUrl : `images/${req.file.filename}`
          })
          req.flash('alertMessage', 'Success Add Bank')
          req.flash('alertStatus', 'success')
          res.redirect('/admin/bank');
      } catch (error) {
          req.flash('alertMessage', `${error.message}`)
          req.flash('alertStatus', 'danger')
          res.redirect('/admin/bank');
      }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`
        await bank.save();
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  deleteBank: async (req, res) => {
    try {
        const { id } = req.params;
        const bank = await Bank.findOne({_id:id});
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        await bank.remove();
        req.flash('alertMessage', 'Success Delete Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
}