# VK Social - MongoDB Only

This is a clean Instagram-style full-stack foundation for VK Social.

## Storage

- User profile images are stored directly in MongoDB.
- Post images/videos are stored directly in MongoDB.
- Story images/videos are stored directly in MongoDB.
- Reel videos are stored directly in MongoDB.
- Media is exposed through `/api/media/:id`.
- This uses MongoDB BSON documents for media. For very large production videos, migrate the `Media` model to MongoDB GridFS because normal BSON documents have a 16 MB document limit.

## Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

## Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open:

http://localhost:5173

## Implemented foundation

Authentication, profile editing, MongoDB avatar upload, posts, multi-image/video upload, comments, likes, saves, stories, reels, follows, notifications, direct-message data model/API, notes, reports, privacy setting, archive/restore/pin endpoints, Socket.IO typing/conversation rooms, mobile bottom navigation.

## Important

Instagram features such as SMS/email verification, real phone/video calls, Live streaming, production push notifications, advanced camera filters, music licensing, recommendation ML, spam moderation and payment/third-party integrations require additional infrastructure/services. This project exposes the core application APIs and UI hooks but does not pretend those external services are implemented locally.
