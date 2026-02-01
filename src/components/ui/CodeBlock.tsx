import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, className }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Đã sao chép mã code!');
        setTimeout(() => setCopied(false), 2000);
    };

    // Basic regex-based syntax highlighting
    const highlightCode = (text: string) => {
        // 1. Escape HTML
        text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const tokens: { pattern: RegExp, color: string }[] = [
            // Comments
            { pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, color: '#6a9955' },
            // Directives
            { pattern: /(#include|#define|#if|#endif|#ifdef|#ifndef|#pragma)/g, color: '#569cd6' },
            // Keywords
            { pattern: /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|async|await|type|interface|default|try|catch|throw|new|this|public|private|protected|static|virtual|override|int|float|double|char|bool|void|unsigned|signed|namespace|using|template|decltype|sizeof|struct|enum|union|asm|volatile|inline|friend|explicit|operator|module|export|import)\b/g, color: '#569cd6' },
            // Strings
            { pattern: /(['"`])(.*?)\1/g, color: '#ce9178' },
            // Numbers
            { pattern: /\b(\d+)\b/g, color: '#b5cea8' },
            // Types/Headers
            { pattern: /(&lt;[a-zA-Z._+]+&gt;)/g, color: '#ce9178' },
        ];

        // Use a placeholder approach to prevent nested replacements
        let result = text;
        const placeholders: string[] = [];

        tokens.forEach((token, i) => {
            result = result.replace(token.pattern, (match) => {
                const placeholder = `___TOKEN_${placeholders.length}___`;
                placeholders.push(`<span style="color: ${token.color}">${match}</span>`);
                return placeholder;
            });
        });

        // Replace placeholders back
        placeholders.forEach((html, i) => {
            result = result.replace(`___TOKEN_${i}___`, html);
        });

        return result;
    };

    return (
        <div className={cn("rounded-xl border border-border/50 bg-[#1e1e1e] overflow-hidden my-4 shadow-xl", className)}>
            {/* VS Code Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex items-center gap-2 ml-4 px-2 py-0.5 rounded bg-white/5 text-[11px] text-muted-foreground font-mono">
                        <Terminal className="w-3 h-3 text-primary" />
                        {language || 'code'}
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-90"
                    title="Sao chép code"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Code Area */}
            <div className="relative p-4 overflow-x-auto custom-scrollbar">
                <pre className="font-mono text-sm leading-relaxed text-[#d4d4d4] selection:bg-primary/30">
                    <code
                        dangerouslySetInnerHTML={{ __html: highlightCode(code.trim()) }}
                        className="block whitespace-pre"
                    />
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
