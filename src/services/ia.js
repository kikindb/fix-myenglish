const COHERE_API_KEY = '1j0wtGkUecusYxGPxGLcka2Y2ED39aNV2ouY7jQu';
const COHERE_API_GENERATE_URL = 'https://api.cohere.ai/generate';

export async function fixMyEnglish(input) {
  const data = {
    model: 'xlarge',
    prompt: `This is a spell checker generator.
    --
    Incorrect sample: "I are good!"
    Correct sample: "I am good!"
    --
    Incorrect sample: "I have cold"
    Correct sample: "I am cold"
    --
    Incorrect sample: "I have hungry"
    Correct sample: "I am hungry"
    --
    Incorrect sample: "${input}"
    Correct sample:`,
    max_tokens: 40,
    temperature: 0.5,
    k: 0,
    p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: ['--'],
    return_likelihoods: 'NONE',
  };
  const response = await fetch(COHERE_API_GENERATE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      CohereVersion: '2022-12-06',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  console.log({ response });
  const { text } = response;
  return text.replace('--', '').replaceAll('"', '').trim();
}
