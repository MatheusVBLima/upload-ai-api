import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.prompt.deleteMany();

  await prisma.prompt.create({
    data: {
      title: "Título do Vídeo",
      template: `Seu papel é gerar três títulos para um vídeo do YouTube.

Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar os títulos.
Abaixo você também receberá uma lista de títulos, use essa lista como referência para os títulos a serem gerados.

Os títulos devem ter no máximo 60 caracteres.
Os títulos devem ser chamativos e atrativos para maximizar os cliques.

Retorne APENAS os três títulos em formato de lista como no exemplo abaixo:
'''
- Título 1
- Título 2
- Título 3
'''

Transcrição:
'''
{transcription}
'''`.trim(),
    },
  });

  await prisma.prompt.create({
    data: {
      title: "Descrição do Vídeo",
      template:
        `Seu papel é gerar uma descrição sucinta para um vídeo do YouTube.
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar a descrição.

A descrição deve possuir no máximo 80 palavras em primeira pessoa contendo os pontos principais do vídeo.

Use palavras chamativas e que cativam a atenção de quem está lendo.

Além disso, no final da descrição inclua uma lista de 3 até 10 hashtags em letra minúscula contendo palavras-chave do vídeo.

O retorno deve seguir o seguinte formato:
'''
Descrição.

#hashtag1 #hashtag2 #hashtag3 ...
'''

Transcrição:
'''
{transcription}
'''`.trim(),
    },
  });

  /*   await prisma.prompt.create({
    data: {
      title: "Perguntas sobre Assunto do Vídeo",
      template:
        `Seu papel é gerar cinco perguntas relacionadas ao assunto do vídeo.

    Seu papel é gerar cinco perguntas relacionadas ao assunto do vídeo.

    Utilize a transcrição do vídeo como base para criar as perguntas.
    Cada pergunta deve conter 5 alternativas (a, b, c, d, e).
    Apenas uma alternativa deve ser ser correta.
    Não inclua opções como "Nenhuma das alternativas anteriores" ou "Todas as alternativas anteriores".
    Após cada pergunta, indique qual é a resposta correta.
    Certifique-se de que as perguntas sejam relevantes e tenham respostas claras na transcrição.
    
    O retorno deve seguir o seguinte formato:
    '''
    1. Pergunta 1? Resposta: Resposta 1
    2. Pergunta 2? Resposta: Resposta 2
    3. Pergunta 3? Resposta: Resposta 3
    4. Pergunta 4? Resposta: Resposta 4
    5. Pergunta 5? Resposta: Resposta 5
    '''

Transcrição:
'''
{transcription}
'''`.trim(),
    },
  }); */
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
