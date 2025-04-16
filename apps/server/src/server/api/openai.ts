export interface OpenAIChoice {
  index: number;
  message: {
    role: 'assistant' | 'user';
    content: string;
  };
  finish_reason: 'stop';
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
