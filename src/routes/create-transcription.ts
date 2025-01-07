import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { z } from "zod";
import { openai } from "../lib/openai";
import { prisma } from "../lib/prisma";

export async function createTranscriptionRoute(app: FastifyInstance) {
app.post("/videos/:videoId/transcription", async (req) => {
    console.log("Iniciando a rota de transcrição...");

    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = paramsSchema.parse(req.params);
    console.log(`ID do vídeo: ${videoId}`);

    const bodySchema = z.object({
      prompt: z.string().default(''),
    });

    const { prompt } = bodySchema.parse(req.body);
    console.log(`Prompt recebido: ${prompt}`);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    const videoPath = video.path;
    console.log(`Caminho do vídeo: ${videoPath}`);

    const audioReadStream = createReadStream(videoPath);

    try {
      const response = await openai.audio.transcriptions.create({
        file: audioReadStream,
        model: "whisper-1",
        language: "pt",
        response_format: "json",
        temperature: 0,
        prompt,
      });

      const transcription = response.text;
      console.log("Transcrição recebida com sucesso.");

      await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          transcription,
        },
      });

      return transcription;
    } catch (error) {
      console.error("Erro ao chamar a API da OpenAI:", error);
      throw new Error("Erro ao processar a transcrição.");
    }
  });
}