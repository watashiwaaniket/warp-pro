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
        content: 'help me generate a simple todo app?' 
    }
    const response = await ollama.chat(
        { 
            model: 'codellama:7b', 
            messages: [systemMessage, basePrompt, userMessage],
            stream: true, 
        })
    for await (const part of response) {
    process.stdout.write(part.message.content)
    }
    
}

main()

