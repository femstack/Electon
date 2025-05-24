const useraccount = require("../models/useraccount");
const { validateUpdate } = require("../middlewares/validate");
const fs = require("fs");
const path = require("path");
const { uniqueImageName } = require("../middlewares/unique");

// const uploadpic = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const { error } = validateUpdate.validate(req.body);
//     if (error) {
//       return res.redirect(`/profile?error=${error.details[0].message}`);
//     }

//     if (user.username !== req.body.username) {
//       const check = await useraccount.findOne({ username: req.body.username });
//       if (check) {
//         return res.redirect(`/profile?error=Username already exists`);
//       }
//     }
//     const photo = req.files?.photo;
//     if (!photo) {
//       return next();
//     } else {
//       const photoname = photo.name;
//       //   const photopath = path.join (__dirname, '../public', photo);
//       const photopath = path.join(__dirname, "../public", photo);
//       if (!fs.existsSync(photopath)) {
//         fs.mkdirSync(photopath, { recursive: true });
//       }

//       const allowedExt = [".jpg", ".jpeg", ".png", ".gif"];
//       const ext = photoname.split(".").pop();
//       const lowerExt = ext.toLowerCase();
//       if (!allowedExt.includes(lowerExt)) {
//         return res.redirect(`/profile?error=File type is not allowed`);
//       }

//       const fizesize = photo.size;
//       if (fizesize > 1024 * 1024) {
//         return res.redirect(`/profile?error=File size is too large`);
//       }

//       const uniqueImage = await uniqueImageName(photoname);
//       const filepath = path.join(photopath, uniqueImage);
//       await photo.mv(filepath, (err) => {
//         if (err) {
//           console.log(err);
//           return res.redirect(`/profile?error=Error while uploading file`);
//         }
//         const imagepath = `/profile/${uniqueImage}`;
//         req.body.photo = imagepath;
//         next();
//       });
//       await photo.mv(filepath);
//       const imagepath = `/uploads/${uniqueImage}`;
//       req.body.photo = imagepath;
//       next();
//     }
//   } catch (error) {
//     console.error(error);
//     return res.redirect(`/profile?error=Something went wrong`);
//   }
// };

const uploadpic = async (req, res, next) => {
  try {
    const user = req.user;
    const { error } = validateUpdate.validate(req.body);
    if (error) {
      return res.redirect(`/profile?error=${error.details[0].message}`);
    }

    if (user.username !== req.body.username) {
      const check = await useraccount.findOne({ username: req.body.username });
      if (check) {
        return res.redirect(`/profile?error=Username already exists`);
      }
    }

    const photo = req.files?.photo;
    if (!photo) {
      return next();
    }

    const photoname = photo.name;
    const allowedExt = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(photoname).toLowerCase();

    if (!allowedExt.includes(ext)) {
      return res.redirect(`/profile?error=File type is not allowed`);
    }

    const filesize = photo.size;
    if (filesize > 1024 * 1024) {
      return res.redirect(`/profile?error=File size is too large`);
    }

    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueImage = await uniqueImageName(photoname);
    const filepath = path.join(uploadDir, uniqueImage);

    photo.mv(filepath, (err) => {
      if (err) {
        console.log(err);
        return res.redirect(`/profile?error=Error while uploading file`);
      }
      req.body.photo = `/uploads/${uniqueImage}`;
      next();
    });
  } catch (error) {
    console.error(error);
    return res.redirect(`/profile?error=Something went wrong`);
  }
};


// const uploadpic = async (req, res, next) => {
//   try {
//     const { error } = validateUpdate(req.body);
//     if (error) {
//       return res.redirect(`/profile?error=${error.details[0].message}`);
//     }

//     const photo = req.files?.photo;
//     if (!photo) return next();

//     const photoname = photo.name;
//     const allowedExt = ['.jpg', '.jpeg', '.png', '.gif'];
//     const ext = path.extname(photoname).toLowerCase();

//     if (!allowedExt.includes(ext)) {
//       return res.redirect(`/profile?error=File type is not allowed`);
//     }

//     if (photo.size > 1024 * 1024) {
//       return res.redirect(`/profile?error=File size is too large`);
//     }

//     const uploadFolder = path.join(__dirname, '../public/uploads');
//     if (!fs.existsSync(uploadFolder)) {
//       fs.mkdirSync(uploadFolder, { recursive: true });
//     }

//     const uniqueImage = await uniqueImageName(photoname);
//     const filepath = path.join(uploadFolder, uniqueImage);

//     await photo.mv(filepath);
//     req.body.photo = `/uploads/${uniqueImage}`; // Accessible path for frontend

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.redirect(`/profile?error=Something went wrong`);
//   }
// };

module.exports = { uploadpic };
