# **Upload AI API**

## **Overview**

The Upload AI API is a RESTful API that allows developers to integrate the Upload AI platform's video upload, transcription, and processing capabilities into their own applications. The API provides a robust and scalable solution for building video-centric applications, making it easy to upload, transcribe, and process video content.

## **Features**

- Video upload and processing
- Transcription of video content
- Support for multiple video formats
- Scalable and robust architecture

## **Technologies Used**

- **Fastify**: A fast and low-latency web framework for Node.js
- **@fastify/cors**: Enables CORS support for Fastify
- **@fastify/multipart**: Enables multipart/form-data support for Fastify
- **@prisma/client**: A database client for Prisma
- **ai**: A library for AI-related tasks
- **openai**: A library for interacting with the OpenAI API
- **zod**: A library for validating and parsing data

## **Getting Started**

### Prerequisites

- Node.js (>= 14.17.0)
- npm (>= 6.14.13)
- Prisma (>= 5.9.1)

### Installation

1. Clone the repository: `git clone https://github.com/your-repo/upload-ai-api.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### API Endpoints

- **POST /videos**: Upload a video file
- **GET /videos**: Retrieve a list of uploaded videos
- **GET /videos/{video_id}**: Retrieve details about a specific video
- **POST /transcriptions**: Request transcription of a video
- **GET /transcriptions**: Retrieve a list of transcription jobs
- **GET /transcriptions/{transcription_id}**: Retrieve details about a specific transcription job

## **Contributing**

Contributions are welcome! If you'd like to contribute to the Upload AI API, please fork the repository and submit a pull request.

## **License**

The Upload AI API is licensed under the MIT License.
