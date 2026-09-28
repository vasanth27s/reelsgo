import express from "express";
import mongoose from "mongoose";

import auth from "../middleware/auth.js";
import PhoneVerification from "../models/PhoneVerification.js";

const router = express.Router();


/*
=========================================================
PHONE NORMALIZATION
=========================================================
*/

function normalizePhone(value) {
  let phone = String(value || "")
    .trim()
    .replace(/[\s().-]/g, "");

  /*
   * If the user enters an Indian 10 digit number:
   *
   * 9876543210
   *
   * convert to:
   *
   * +919876543210
   */

  if (/^[6-9]\d{9}$/.test(phone)) {
    phone = `+91${phone}`;
  }

  return phone;
}


/*
=========================================================
E.164 VALIDATION
=========================================================
*/

function isE164(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}


/*
=========================================================
CURRENT USER ID
=========================================================
*/

function getCurrentUserId(req) {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId
  );
}


/*
=========================================================
GET VERIFICATION STATUS

GET

/api/verification/status/:userId

PUBLIC ENDPOINT

IMPORTANT:
We only return true/false.

The actual phone number is NEVER returned.
=========================================================
*/

router.get(
  "/status/:userId",
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.json({
          verified: false
        });
      }

      const record =
        await PhoneVerification.findOne({
          user: userId,
          verifiedAt: {
            $ne: null
          }
        }).select("_id");

      return res.json({
        verified: Boolean(record)
      });

    } catch (error) {
      console.error(
        "Verification status error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to load verification status"
      });
    }
  }
);


/*
=========================================================
GET CURRENT USER VERIFICATION

GET

/api/verification/me

AUTH REQUIRED
=========================================================
*/

router.get(
  "/me",
  auth,
  async (req, res) => {
    try {
      const userId =
        getCurrentUserId(req);

      if (!userId) {
        return res.status(401).json({
          message:
            "Authentication required"
        });
      }

      const record =
        await PhoneVerification.findOne({
          user: userId
        })
          .select(
            "verifiedAt createdAt"
          )
          .lean();

      return res.json({
        verified: Boolean(record),

        verifiedAt:
          record?.verifiedAt || null,

        createdAt:
          record?.createdAt || null
      });

    } catch (error) {
      console.error(
        "Verification me error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to load verification details"
      });
    }
  }
);


/*
=========================================================
SAVE PHONE NUMBER

POST

/api/verification/phone/confirm

AUTH REQUIRED

NO OTP
NO FIREBASE
NO TWILIO
NO SMS
=========================================================
*/

router.post(
  "/phone/confirm",
  auth,
  async (req, res) => {
    try {
      /*
      -----------------------------------------------
      GET CURRENT USER
      -----------------------------------------------
      */

      const userId =
        getCurrentUserId(req);

      if (!userId) {
        return res.status(401).json({
          message:
            "Authentication required"
        });
      }


      /*
      -----------------------------------------------
      GET PHONE
      -----------------------------------------------
      */

      const phone =
        normalizePhone(
          req.body?.phone
        );


      /*
      -----------------------------------------------
      VALIDATE PHONE
      -----------------------------------------------
      */

      if (!isE164(phone)) {
        return res.status(400).json({
          message:
            "Enter a valid phone number. Example: +919876543210."
        });
      }


      /*
      -----------------------------------------------
      CHECK IF THIS ACCOUNT IS ALREADY VERIFIED
      -----------------------------------------------
      */

      const existingUserRecord =
        await PhoneVerification.findOne({
          user: userId
        });

      if (existingUserRecord) {
        return res.status(409).json({
          message:
            "Your ReelsGo account is already verified. A phone number can be entered only once."
        });
      }


      /*
      -----------------------------------------------
      CHECK IF PHONE IS ALREADY USED
      -----------------------------------------------
      */

      const existingPhone =
        await PhoneVerification.findOne({
          phoneE164: phone
        });

      if (existingPhone) {
        return res.status(409).json({
          message:
            "This phone number is already verified on another ReelsGo account. One phone number can verify only one account."
        });
      }


      /*
      -----------------------------------------------
      CREATE VERIFICATION
      -----------------------------------------------
      */

      const record =
        new PhoneVerification({
          user: userId,

          phoneE164: phone,

          verifiedAt: new Date()
        });


      /*
      -----------------------------------------------
      SAVE TO MONGODB
      -----------------------------------------------
      */

      await record.save();


      /*
      -----------------------------------------------
      SUCCESS
      -----------------------------------------------
      */

      return res.status(201).json({
        ok: true,

        verified: true,

        verifiedAt:
          record.verifiedAt,

        message:
          "Phone number saved successfully. Your ReelsGo blue tick is now active."
      });

    } catch (error) {

      /*
      -----------------------------------------------
      MONGODB DUPLICATE KEY
      -----------------------------------------------
      */

      if (
        error?.code === 11000
      ) {

        if (
          error?.keyPattern?.phoneE164
        ) {
          return res.status(409).json({
            message:
              "This phone number is already verified on another ReelsGo account."
          });
        }

        if (
          error?.keyPattern?.user
        ) {
          return res.status(409).json({
            message:
              "Your ReelsGo account is already verified. A phone number can be entered only once."
          });
        }

        return res.status(409).json({
          message:
            "This phone number is already linked to a verified account."
        });
      }


      /*
      -----------------------------------------------
      OTHER ERROR
      -----------------------------------------------
      */

      console.error(
        "Phone verification error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to save phone number"
      });
    }
  }
);


export default router;