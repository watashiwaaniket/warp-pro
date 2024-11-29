
import ollama from 'ollama';

async function main() {
    const message = { role: 'user', content: 'Why is the sky blue?' }
    const response = await ollama.chat({ model: 'codellama:7b', messages: [message], stream: true })
    for await (const part of response) {
    process.stdout.write(part.message.content)
    }
    
}

main()

