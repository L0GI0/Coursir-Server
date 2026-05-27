# Coursir-Server

Backend API server for the [Coursir](../Coursir) learning management platform. Built with Express, TypeScript, and DynamoDB.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** DynamoDB (via Dynamoose ODM)
- **Authentication:** Clerk
- **Payments:** Stripe
- **File Uploads:** Multer + AWS S3 / CloudFront
- **Deployment:** AWS Lambda (via `serverless-http`) with Docker

## API Routes

| Endpoint | Auth | Description |
|---|---|---|
| `GET /courses` | No | List all courses |
| `POST /courses` | Yes | Create a course |
| `GET /courses/:courseId` | No | Get course details |
| `PUT /courses/:courseId` | Yes | Update a course (with image upload) |
| `DELETE /courses/:courseId` | Yes | Delete a course |
| `POST /courses/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url` | Yes | Get a pre-signed video upload URL |
| `PUT /users/clerk/:userId` | Yes | Update user profile |
| `GET /transactions` | Yes | List transactions |
| `POST /transactions` | Yes | Create a transaction |
| `POST /transactions/stripe/payment-intent` | Yes | Create a Stripe payment intent |
| `GET /users/course-progress/:userId/enrolled-courses` | Yes | Get user's enrolled courses |
| `GET /users/course-progress/:userId/courses/:courseId` | Yes | Get progress for a specific course |
| `PUT /users/course-progress/:userId/courses/:courseId` | Yes | Update course progress |

## Prerequisites

- Node.js (v20+)
- [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) (for development)
- A [Clerk](https://clerk.com) account (authentication)
- A [Stripe](https://stripe.com) account (payments)
- AWS account with S3 and CloudFront configured (for media storage, production)

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Configure environment variables:**

   Copy the example env file and fill in your values:

   ```sh
   cp .env.example .env
   ```

   See `.env.example` for required variables.

3. **Start DynamoDB Local** (must be running before the dev server):

   ```sh
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```

4. **Seed the database** (optional — populates sample data):

   ```sh
   npm run seed
   ```

5. **Run the development server:**

   ```sh
   npm run dev
   ```

   The server will start on the port specified in your `.env` file (default: `8001`).

## Scripts

- `npm run dev` — Build and start the development server with hot reload
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Build and run the production server
- `npm run seed` — Seed DynamoDB with sample data

## Project Structure

```
src/
├── index.ts                 # App entry point & middleware setup
├── controllers/             # Route handlers
│   ├── courseController.ts
│   ├── transactionController.ts
│   ├── userClerkController.ts
│   └── userCourseProgressController.ts
├── models/                  # Dynamoose data models
│   ├── courseModel.ts
│   ├── transactionModel.ts
│   └── userCourseProgressModel.ts
├── routes/                  # Express route definitions
│   ├── courseRoutes.ts
│   ├── transactionRoutes.ts
│   ├── userClerkRoutes.ts
│   └── userCourseProgressRoutes.ts
├── seed/                    # Database seeding
│   ├── seedDynamodb.ts
│   └── data/                # Sample JSON seed data
└── utils/
    └── utils.ts
```

## Deployment

The server is containerised with the included `Dockerfile` and deployed to AWS Lambda using `serverless-http`. The Lambda handler is exported from `src/index.ts`.
