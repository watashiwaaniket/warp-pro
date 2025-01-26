import ollama from 'ollama';
import express from 'express';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import { reactBasePrompt } from './defaults/react';

const app = express();
app.use(express.json());

const model = 'deepseek-r1:7b';
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

app.post('/template',async (req, res) => {
    const prompt = req.body.prompt;

    const response = await ollama.chat(
        { 
            model: 'mistral:latest', 
            messages: [{ role: 'user', content: `prompt -> ${prompt}` },
                {
                    role: 'user',
                    content: 'Given the prompt, return either react or node based on what you think the project should be. Only return a single word either "node" or "react". IMPORTANT: Use only one word response no braces, no special characters, no anything, just the two defined words.',
                },],
        })
    
    const answer = await response.message.content;

    if(answer.trim() == "React"){
        res.json({
            prompts: [reactBasePrompt, systemMessage, basePrompt, userMessage]
        })
        return;
    }
    if(answer.trim() == "Node"){
        res.json({
            prompts: [systemMessage, basePrompt, userMessage]
        })
        return;
    }

    res.status(403).json({
        message: "You cannot access this!"
    })
    return;
})

async function main() {    
    const response = await ollama.chat(
        { 
            model: model, 
            messages: [systemMessage, basePrompt, userMessage],
            stream: true, 
        })
    for await (const part of response) {
    process.stdout.write(part.message.content)
    }
    
}

// main()
app.listen(3000, () => {
    console.log('Server listening on port 3000')
})
