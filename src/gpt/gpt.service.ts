import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

import OpenAI from "openai";


@Injectable()
export class GptService {
    private _aiKey: string;
    private _content: string
    private _observeContent: string
    constructor(private configService: ConfigService) {
        this._aiKey = configService.get<string>('AI_KEY');
        this._content = readFileSync('./src/gpt/template').toString();
        this._observeContent = readFileSync('./src/gpt/observeTemplate').toString();
        console.log(this._observeContent)
    }

    async askGpt(query: string): Promise<string> {
        try{
            const openai = new OpenAI({ apiKey: this._aiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: this._content },
                    { role: "user", content: query },
                ],
                model: "gpt-3.5-turbo",
            });
            return completion.choices[0].message.content;
        }
        catch(err){
            console.log(err);
        }
    }
    async askAboutContent(query: string): Promise<string> {
        try{
            const openai = new OpenAI({ apiKey: this._aiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: this._observeContent },
                    { role: "user", content: query },
                ],
                model: "gpt-3.5-turbo",
            });
            return completion.choices[0].message.content;
        }
        catch(err){
            console.log(err);
        }
    }
    async askChatGtp (query: string): Promise<string>{
        try{
            const openai = new OpenAI({ apiKey: this._aiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "user", content: query },
                ],
                model: "gpt-4o",
            });
            return completion.choices[0].message.content;
        }
        catch(err){
            console.log(err);
        }
    }

}
