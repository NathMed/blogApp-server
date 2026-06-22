# Adventurer's Codex

A fantasy RPG-themed blog app where users post **quests** (articles), earn **levels** by writing, and vote on each other's content.

---

## Setup

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root:
```env
MONGODB_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
PORT=4000
```

3. Run the server:
```bash
node index.js
```

Server runs at `http://localhost:4000`. Frontend (Vue/Vite) runs at `http://localhost:5173`.

---

## Test Credentials

To make an admin account, register normally then run this in MongoDB shell:
```js
db.users.updateOne({ email: "admin@guild.com" }, { $set: { isAdmin: true } })
```
Or log in with the existing admin credentials:

| Role  | Email | Password |
|---|---|---|
| Admin | `admin123@mail.com` | `admin123` |
| User  | `jonh1234@mail.com`  | `jonh1234` |

---

## 📡 API Endpoints

All protected routes need this header:
```
Authorization: Bearer <token>
```

### Users — `/users`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Create an account |
| POST | `/login` | None | Login, returns JWT token |
| GET | `/details` | ✅ | Get your profile + level |
| GET | `/allUser` | ✅ | Get all users |

### Posts — `/posts`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/getAllPost` | None | Get all posts (public) |
| GET | `/getMyOwnPost` | ✅ | Get your own posts |
| GET | `/viewPost/:postId` | None | View a single post |
| POST | `/addPost` | ✅ | Create a new post |
| PATCH | `/editPost/:postId` | ✅ Owner only | Edit your post |
| DELETE | `/deletePost/:postId` | ✅ Owner or Admin | Delete a post |
| POST | `/:postId/comments` | ✅ | Add a comment |
| GET | `/:postId/getComments` | ✅ | Get comments |
| PATCH | `/:postId/upvote` | ✅ | Toggle upvote |
| PATCH | `/:postId/downvote` | ✅ | Toggle downvote |
| PATCH | `/:postId/flag` | ✅ | Flag a post |
| PATCH | `/:postId/unflag` | ✅ Admin only | Approve a flagged post |

---

## 🏆 Level System

Your level goes up every time you post a quest.

```
XP per post    = 1000
XP per level   = 1500
Level formula  = floor(totalXP / 1500) + 1
```

| Posts | Level |
|---|---|
| 0 | 1 |
| 2 | 2 |
| 3 | 3 |
| 5 | 4 |

---

## 📁 Folder Structure

```
├── controllers/
│   ├── post.js
│   └── user.js
├── models/
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── post.js
│   └── user.js
├── auth.js
├── index.js
└── .env
```