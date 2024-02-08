import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { openai } from "../lib/openai";

const pump = promisify(pipeline);

export async function uploadTextRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_000_000 * 50, // 50MB
    },
  });

  app.post("/texts", async (req, reply) => {
    const data = await req.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".txt") {
      return reply
        .status(400)
        .send({ error: "Invalid file type, only TXT allowed" });
    }

    const fileBaseName = path.basename(data.filename, extension);

    const textFilePath = path.resolve(__dirname, "../../tmp", data.filename);

    await pump(data.file, fs.createWriteStream(textFilePath));

    const textContent = fs.readFileSync(textFilePath, "utf-8");

    const speechFile = path.resolve(
      __dirname,
      `../../tmp/${fileBaseName}-speech.mp3`
    );

    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: textContent,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
    } catch (error) {
      console.error("Error generating audio:", error);
      return reply.status(500).send({ error: "Error generating audio" });
    }

    const relativeSpeechFilePath = speechFile.split("tmp")[1];
    return {
      speechFile: relativeSpeechFilePath,
    };
  });

  app.get("/audio", async (req, reply) => {
    try {
      const { file } = req.query as { file?: string };
      if (typeof file !== "string") {
        throw new Error("Invalid file parameter");
      }

      const audioFilePath = path.join(__dirname, "../../tmp", file);
      const audioContent = fs.readFileSync(audioFilePath);

      reply.type("audio/mpeg").send(audioContent);
    } catch (error) {
      console.error("Error serving audio file:", error);
      reply.status(500).send({ error: "Error serving audio file" });
    }
  });
}
