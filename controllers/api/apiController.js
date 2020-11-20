const Product = require('../../models/Product');
const Treveler = require('../../models/Booking');
const Category = require('../../models/Category');
const Bank = require('../../models/Bank');
const Booking = require('../../models/Booking');
const Member = require('../../models/Member');
const User = require('../../models/User');

module.exports = {
  login: async (req, res) => {
    const {email} = req.body;
    const isLogin = false;
    try {
      if(req.session.member.id == undefined || req.session.member.id == null )
      {
        const user = await User.findOne({email:email})
        if(user.length > 0){
          islogin = true;
          req.session.member= {
              id:user.id,
              name:user.name,
              user:user.email
          }
        }
      }
      else{
        
      }

      res.status(200).json({
        user, 
        islogin
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addMember: async (req, res) => {
    const {
      fullName,
      email,
      city,
      phoneNumber,
    } = req.body;
    try {
      const member = await Member.create({
        fullName,
        city,
        email,
        phoneNumber
      }); 
      res.status(200).json({
        message:"Success add member"
      })
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  loginMember: async (req, res) => {
    const {
      email
    } = req.body;
    try {
      const member = await Member.findOne({email:email})
      if(member){
        res.status(200).json({
          member
        })
      }else{
        res.status(500).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getProducts: async (req, res) => {
    try {
      const allProduct = await Product.find()
        .select('_id title brand price imageId')
        .limit(5)
        .populate({ path: 'imageId', select: '_id imageUrl' })

    //   const category = await Category.find()
    //     .select('_id name')
    //     .limit(3)
    //     .populate({
    //       path: 'productId',
    //       select: '_id title brand imageId',
    //       perDocumentLimit: 4,
    //       option: { sort: { sumBooking: -1 } },
    //       populate: {
    //         path: 'imageId',
    //         select: '_id imageUrl',
    //         perDocumentLimit: 1
    //       }
    //     })

      res.status(200).json({
        allProduct, 
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getDetailProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id })
        .populate({ path: 'featureId', select: '_id name imageUrl' })
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const bank = await Bank.find();

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content: "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer"
      }

      res.status(200).json({
        ...product._doc,
        bank,
        testimonial
      })

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idProduct,
      duration,
      // price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: "Image not found" });
    }

    console.log(idProduct)

    if (
      idProduct === undefined ||
      duration === undefined ||
      // price === undefined ||
      bookingStartDate === undefined ||
      bookingEndDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined) {
      res.status(404).json({ message: "Lengkapi semua field" });
    }

    const product = await PRoduct.findOne({ _id: idProduct });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.sumBooking += 1;

    await product.save();

    let total = product.price * duration;
    let tax = total * 0.10;

    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: total += tax,
      productId: {
        _id: product.id,
        title: product.title,
        price: product.price,
        duration: duration
      },

      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder
      }
    }

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: "Success Booking", booking });
  }
}

