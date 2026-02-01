import React from 'react';
import CodeBlock from '@/components/ui/CodeBlock';

interface ContentRendererProps {
    content: string;
    className?: string;
}

export const renderContent = (content: string) => {
    // Regex to find code blocks: ```[language]\n[code]```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
            // Extract language and code
            const innerContent = part.slice(3, -3).trim();
            const firstNewLineIndex = innerContent.indexOf('\n');

            let language = '';
            let code = innerContent;

            if (firstNewLineIndex !== -1) {
                const possibleLanguage = innerContent.slice(0, firstNewLineIndex).trim();
                // Basic check if it's a language name or just part of the code
                if (possibleLanguage.length < 20 && !possibleLanguage.includes(' ')) {
                    language = possibleLanguage;
                    code = innerContent.slice(firstNewLineIndex + 1).trim();
                }
            }

            return <CodeBlock key={index} code={code} language={language} />;
        }

        return (
            <div key={index} className="whitespace-pre-wrap mb-2 last:mb-0">
                {part}
            </div>
        );
    });
};

const ContentRenderer: React.FC<ContentRendererProps> = ({ content, className = "" }) => {
    return (
        <div className={`prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed ${className}`}>
            {renderContent(content)}
        </div>
    );
};

export default ContentRenderer;
