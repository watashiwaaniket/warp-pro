"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ollama_1 = __importDefault(require("ollama"));
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
const react_1 = require("./defaults/react");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const model = 'deepseek-r1:7b';
const systemMessage = {
    role: 'system',
    content: (0, prompts_1.getSystemPrompt)()
};
const basePrompt = {
    role: 'user',
    content: prompts_1.BASE_PROMPT
};
const userMessage = {
    role: 'user',
    content: 'create a simple todo app in nextjs'
};
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield ollama_1.default.chat({
        model: 'mistral:latest',
        messages: [{ role: 'user', content: `prompt -> ${prompt}` },
            {
                role: 'user',
                content: 'Given the prompt, return either react or node based on what you think the project should be. Only return a single word either "node" or "react". IMPORTANT: Use only one word response no braces, no special characters, no anything, just the two defined words.',
            },],
    });
    const answer = yield response.message.content;
    if (answer.trim() == "React") {
        res.json({
            prompts: [react_1.reactBasePrompt, systemMessage, basePrompt, userMessage]
        });
        return;
    }
    if (answer.trim() == "Node") {
        res.json({
            prompts: [systemMessage, basePrompt, userMessage]
        });
        return;
    }
    // res.status(403).json({
    //     message: "You cannot access this!"
    // })
    res.json(answer.trim());
    return;
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const response = yield ollama_1.default.chat({
            model: model,
            messages: [systemMessage, basePrompt, userMessage],
            stream: true,
        });
        try {
            for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _d = true) {
                _c = response_1_1.value;
                _d = false;
                const part = _c;
                process.stdout.write(part.message.content);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
// main()
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
