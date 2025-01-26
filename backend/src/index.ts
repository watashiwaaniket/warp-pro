import ollama from 'ollama';
import { BASE_PROMPT, getSystemPrompt } from './prompts';

async function main() {
    const systemMessage = { 
        role: 'system', 
        content: getSystemPrompt() 
    };
    const basePrompt = {
        role: 'user',
        content: BASE_PROMPT
    }

    const userMessage = { 
        role: 'user', 
        content: 'create a simple todo app in nextjs' 
    }
    const response = await ollama.chat(
        { 
            model: 'deepseek-r1:7b', 
            messages: [systemMessage, basePrompt, userMessage],
            stream: true, 
        })
    for await (const part of response) {
    process.stdout.write(part.message.content)
    }
    
}

main()

