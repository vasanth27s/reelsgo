import express from "express";



import bcrypt from "bcryptjs";



import auth from "../middleware/auth.js";



import { uploadImage } from "../middleware/upload.js";



import User from "../models/User.js";



import Follow from "../models/Follow.js";



import Post from "../models/Post.js";



import Reel from "../models/Reel.js";



const router = express.Router();



/*



|--------------------------------------------------------------------------



| POST VIEW



|--------------------------------------------------------------------------



*/



function postView(post) {



  const obj = post.toObject



    ? post.toObject()



    : post;



  obj.media = (obj.media || []).map((media) => ({



    ...media,



    url: media.mediaId



      ? `/api/media/${media.mediaId}`



      : null,



  }));



  return obj;



}



/*



|--------------------------------------------------------------------------



| REEL VIEW



|--------------------------------------------------------------------------



*/



function reelView(reel) {



  const obj = reel.toObject



    ? reel.toObject()



    : reel;



  return {



    ...obj,



    mediaUrl: obj.mediaId



      ? `/api/media/${obj.mediaId}`



      : null,



    coverUrl: obj.coverMediaId



      ? `/api/media/${obj.coverMediaId}`



      : null,



  };



}



/*



|--------------------------------------------------------------------------



| SAFE USER



|--------------------------------------------------------------------------



*/



function safe(user) {



  const obj = user.toObject



    ? user.toObject()



    : { ...user };



  delete obj.password;



  if (obj.avatar) {



    delete obj.avatar.data;



  }



  return obj;



}



/*



|--------------------------------------------------------------------------



| GET CURRENT USER



|--------------------------------------------------------------------------



*/



router.get("/me", auth, async (req, res) => {



  try {



    const user = await User.findById(req.user.id)



      .select("-password -avatar.data");



    if (!user) {



      return res.status(404).json({



        message: "User not found",



      });



    }



    return res.json({



      user,



    });



  } catch (error) {



    console.error("Get me error:", error);



    return res.status(500).json({



      message: "Unable to load user",



      error: error.message,



    });



  }



});



/*



|--------------------------------------------------------------------------



| CLOSE FRIENDS



|--------------------------------------------------------------------------



| Requires this field in models/User.js:



| closeFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]



|--------------------------------------------------------------------------



*/



// GET /api/users/me/close-friends



router.get("/me/close-friends", auth, async (req, res) => {



  try {



    const user = await User.findById(req.user.id)



      .populate("closeFriends", "name username avatar isPrivate")



      .select("-password -avatar.data");



    if (!user) {



      return res.status(404).json({ message: "User not found" });



    }



    return res.json({ closeFriends: user.closeFriends || [] });



  } catch (error) {



    console.error("Get Close Friends error:", error);



    return res.status(500).json({



      message: "Unable to load Close Friends",



      error: error.message,



    });



  }



});



// ADD a user to the current user's Close Friends list



// POST /api/users/me/close-friends  body: { "userId": "..." }



router.post("/me/close-friends", auth, async (req, res) => {



  try {



    const { userId } = req.body || {};



    if (!userId || !/^[a-f\d]{24}$/i.test(String(userId))) {



      return res.status(400).json({ message: "A valid userId is required" });



    }



    if (String(userId) === String(req.user.id)) {



      return res.status(400).json({ message: "You cannot add yourself" });



    }



    const person = await User.findById(userId).select("_id");



    if (!person) {



      return res.status(404).json({ message: "User not found" });



    }



    const user = await User.findByIdAndUpdate(



      req.user.id,



      { $addToSet: { closeFriends: person._id } },



      { new: true }



    ).populate("closeFriends", "name username avatar isPrivate");



    if (!user) {



      return res.status(404).json({ message: "User not found" });



    }



    return res.json({ closeFriends: user.closeFriends || [] });



  } catch (error) {



    console.error("Add Close Friend error:", error);



    return res.status(500).json({



      message: "Unable to add Close Friend",



      error: error.message,



    });



  }



});



// REMOVE a user from the current user's Close Friends list



// DELETE /api/users/me/close-friends/:userId



router.delete("/me/close-friends/:userId", auth, async (req, res) => {



  try {



    const { userId } = req.params;



    if (!/^[a-f\d]{24}$/i.test(String(userId))) {



      return res.status(400).json({ message: "Invalid user id" });



    }



    const user = await User.findByIdAndUpdate(



      req.user.id,



      { $pull: { closeFriends: userId } },



      { new: true }



    ).populate("closeFriends", "name username avatar isPrivate");



    if (!user) {



      return res.status(404).json({ message: "User not found" });



    }



    return res.json({ closeFriends: user.closeFriends || [] });



  } catch (error) {



    console.error("Remove Close Friend error:", error);



    return res.status(500).json({



      message: "Unable to remove Close Friend",



      error: error.message,



    });



  }



});



/*



|--------------------------------------------------------------------------



| UPDATE CURRENT USER



|--------------------------------------------------------------------------



*/



// Change password for the authenticated account. Passwords are never returned to the client.



router.patch("/me/password", auth, async (req, res) => {



  try {



    const { currentPassword, newPassword } = req.body || {};



    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current password and new password are required." });



    if (String(newPassword).length < 8) return res.status(400).json({ message: "New password must be at least 8 characters." });



    if (String(newPassword).length > 128) return res.status(400).json({ message: "New password is too long." });



    const user = await User.findById(req.user.id).select("+password");



    if (!user) return res.status(404).json({ message: "User not found." });



    if (!user.password) return res.status(400).json({ message: "Password login is not enabled for this account." });



    const valid = await bcrypt.compare(String(currentPassword), String(user.password));



    if (!valid) return res.status(400).json({ message: "Current password is incorrect." });



    user.password = await bcrypt.hash(String(newPassword), 12);



    await user.save();



    return res.json({ message: "Password updated successfully." });



  } catch (error) {



    console.error("Change password error:", error);



    return res.status(500).json({ message: "Unable to update password." });



  }



});



router.put("/me", auth, async (req, res) => {



  try {



    const user = await User.findById(req.user.id);



    if (!user) {



      return res.status(404).json({



        message: "User not found",



      });



    }



    const allowedFields = ["name", "username", "email", "bio", "website", "isPrivate"];



    for (const field of allowedFields) {



      if (req.body?.[field] !== undefined) {



        if (typeof req.body[field] === "string") user[field] = req.body[field].trim();



        else if (field === "isPrivate") user[field] = Boolean(req.body[field]);



      }



    }



    if (user.username) {



      user.username = user.username.replace(/^@/, "").toLowerCase();



      if (!/^[a-z0-9._]{3,30}$/.test(user.username)) {



        return res.status(400).json({ message: "Username must be 3–30 characters and use only letters, numbers, dots or underscores." });



      }



      const duplicateUsername = await User.findOne({ username: user.username, _id: { $ne: user._id } }).select("_id");



      if (duplicateUsername) return res.status(409).json({ message: "That username is already in use." });



    }



    if (user.email) {



      user.email = user.email.toLowerCase();



      const duplicateEmail = await User.findOne({ email: user.email, _id: { $ne: user._id } }).select("_id");



      if (duplicateEmail) return res.status(409).json({ message: "That email is already in use." });



    }



    await user.save();



    return res.json({



      user: safe(user),



    });



  } catch (error) {



    console.error("Update user error:", error);



    return res.status(500).json({



      message: "Unable to update profile",



      error: error.message,



    });



  }



});



/*



|--------------------------------------------------------------------------



| UPLOAD AVATAR



|--------------------------------------------------------------------------



*/



router.post(



  "/me/avatar",



  auth,



  uploadImage.single("avatar"),



  async (req, res) => {



    try {



      if (!req.file) {



        return res.status(400).json({



          message: "Please select an image",



        });



      }



      const user = await User.findById(req.user.id);



      if (!user) {



        return res.status(404).json({



          message: "User not found",



        });



      }



      user.avatar = {



        data: req.file.buffer,



        contentType: req.file.mimetype,



        fileName: req.file.originalname,



      };



      await user.save();



      return res.json({



        user: safe(user),



        avatarUrl:



          `/api/users/${user._id}/avatar`,



      });



    } catch (error) {



      console.error("Avatar upload error:", error);



      return res.status(500).json({



        message: "Unable to upload avatar",



        error: error.message,



      });



    }



  }



);



/*



|--------------------------------------------------------------------------



| GET AVATAR



|--------------------------------------------------------------------------



*/



router.get("/:id/avatar", async (req, res) => {



  try {



    const user = await User.findById(



      req.params.id



    ).select("avatar");



    if (!user?.avatar?.data) {



      return res.status(404).send(



        "Avatar not found"



      );



    }



    res.set(



      "Content-Type",



      user.avatar.contentType ||



        "image/jpeg"



    );



    res.set(



      "Cache-Control",



      "public, max-age=3600"



    );



    return res.send(user.avatar.data);



  } catch (error) {



    console.error("Get avatar error:", error);



    return res.status(500).send(



      "Unable to load avatar"



    );



  }



});



/*



|--------------------------------------------------------------------------



| DELETE AVATAR



|--------------------------------------------------------------------------



*/



router.delete(



  "/me/avatar",



  auth,



  async (req, res) => {



    try {



      const user = await User.findById(



        req.user.id



      );



      if (!user) {



        return res.status(404).json({



          message: "User not found",



        });



      }



      user.avatar = undefined;



      await user.save();



      return res.json({



        user: safe(user),



      });



    } catch (error) {



      console.error(



        "Delete avatar error:",



        error



      );



      return res.status(500).json({



        message: "Unable to delete avatar",



        error: error.message,



      });



    }



  }



);



/*



|--------------------------------------------------------------------------



| SEARCH USERS



|--------------------------------------------------------------------------



*/



router.get("/search", auth, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().slice(0, 50);

    if (!q) {
      return res.status(200).json({ users: [] });
    }

    // Escape regex syntax so searches are treated as plain text.
    const escapedQuery = q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");

    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { username: { $regex: escapedQuery, $options: "i" } },
        { name: { $regex: escapedQuery, $options: "i" } },
      ],
    })
      .select("_id name username bio avatar.contentType isPrivate")
      .limit(30)
      .lean();

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    return res.status(500).json({
      message: "Unable to search users",
    });
  }
});



/*



|--------------------------------------------------------------------------



| GET USER PROFILE



|--------------------------------------------------------------------------



|



| Important fields returned:



|



| followStatus



| canViewContent



| canViewConnections



| mutualFollow



|



|--------------------------------------------------------------------------



*/



router.get(



  "/:id/profile",



  auth,



  async (req, res) => {



    try {



      const user = await User.findById(



        req.params.id



      )



        .select(



          "-password -avatar.data"



        )



        .lean();



      if (!user) {



        return res.status(404).json({



          message: "User not found",



        });



      }



      const isSelf =



        String(user._id) ===



        String(req.user.id);



      /*



      |--------------------------------------------------------------------------



      | Current user's relationship to profile owner



      |--------------------------------------------------------------------------



      */



      const relationship = isSelf



        ? null



        : await Follow.findOne({



            follower: req.user.id,



            following: user._id,



          }).lean();



      const followStatus = isSelf



        ? "self"



        : relationship?.status ||



          "none";



      /*



      |--------------------------------------------------------------------------



      | CONNECTION PRIVACY



      |--------------------------------------------------------------------------



      */



      let canViewConnections =



        isSelf || !user.isPrivate;



      let mutualFollow = false;



      /*



      |--------------------------------------------------------------------------



      | Private profile



      |--------------------------------------------------------------------------



      */



      if (



        !isSelf &&



        user.isPrivate



      ) {



        /*



        |--------------------------------------------------------------------------



        | Viewer -> profile owner



        |--------------------------------------------------------------------------



        */



        const viewerFollowsOwner =



          followStatus === "accepted";



        /*



        |--------------------------------------------------------------------------



        | Profile owner -> viewer



        |--------------------------------------------------------------------------



        */



        const ownerFollowsViewer =



          await Follow.exists({



            follower: user._id,



            following: req.user.id,



            status: "accepted",



          });



        /*



        |--------------------------------------------------------------------------



        | Mutual accepted relationship



        |--------------------------------------------------------------------------



        */



        mutualFollow =



          viewerFollowsOwner &&



          !!ownerFollowsViewer;



        canViewConnections =



          mutualFollow;



      }



      /*



      |--------------------------------------------------------------------------



      | CONTENT PRIVACY



      |--------------------------------------------------------------------------



      |



      | Private account content is available to:



      |



      | - owner



      | - accepted follower



      |



      |--------------------------------------------------------------------------



      */



      const canViewContent =



        isSelf ||



        !user.isPrivate ||



        followStatus === "accepted";



      /*



      |--------------------------------------------------------------------------



      | Private account not accessible



      |--------------------------------------------------------------------------



      */



      if (!canViewContent) {



        return res.json({



          user,



          followStatus,



          canViewContent: false,



          canViewConnections,



          mutualFollow,



          posts: [],



          reels: [],



          tagged: [],



        });



      }



      /*



      |--------------------------------------------------------------------------



      | POSTS



      |--------------------------------------------------------------------------



      */



      const posts =



        await Post.find({



          author: user._id,



          archived: false,



          deletedAt: null,



        })



          .populate(



            "author",



            "name username isPrivate"



          )



          .sort({



            pinned: -1,



            createdAt: -1,



          })



          .limit(100)



          .lean();



      /*



      |--------------------------------------------------------------------------



      | REELS



      |--------------------------------------------------------------------------



      */



      const reels =



        await Reel.find({



          author: user._id,



        })



          .populate(



            "author",



            "name username isPrivate"



          )



          .sort({



            createdAt: -1,



          })



          .limit(100)



          .lean();



      /*



      |--------------------------------------------------------------------------



      | TAGGED POSTS



      |--------------------------------------------------------------------------



      */



      const tagged =



        await Post.find({



          mentions: user._id,



          archived: false,



          deletedAt: null,



        })



          .populate(



            "author",



            "name username isPrivate"



          )



          .sort({



            createdAt: -1,



          })



          .limit(100)



          .lean();



      /*



      |--------------------------------------------------------------------------



      | RESPONSE



      |--------------------------------------------------------------------------



      */



      return res.json({



        user,



        followStatus,



        canViewContent: true,



        canViewConnections,



        mutualFollow,



        posts:



          posts.map(postView),



        reels:



          reels.map(reelView),



        tagged:



          tagged.map(postView),



      });



    } catch (error) {



      console.error(



        "Profile error:",



        error



      );



      return res.status(500).json({



        message: "Unable to load profile",



        error: error.message,



      });



    }



  }



);



/*



|--------------------------------------------------------------------------



| GET USER BY ID



|--------------------------------------------------------------------------



*/



router.get(



  "/:id",



  auth,



  async (req, res) => {



    try {



      const user =



        await User.findById(



          req.params.id



        ).select(



          "-password -avatar.data"



        );



      if (!user) {



        return res.status(404).json({



          message: "User not found",



        });



      }



      const following =



        await Follow.findOne({



          follower: req.user.id,



          following: user._id,



          status: "accepted",



        });



      return res.json({



        user,



        following:



          !!following,



      });



    } catch (error) {



      console.error(



        "Get user error:",



        error



      );



      return res.status(500).json({



        message: "Unable to load user",



        error: error.message,



      });



    }



  }



);



export default router;