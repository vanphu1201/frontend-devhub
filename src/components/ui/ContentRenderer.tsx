import React from 'react';
import CodeBlock from '@/components/ui/CodeBlock';
import {
    Info,
    Lightbulb,
    AlertTriangle,
    AlertCircle,
    MessageCircle,
    CheckCircle2
} from 'lucide-react';

interface ContentRendererProps {
    content: string;
    className?: string;
}

export const renderContent = (content: string) => {
    // Phase 1: Split by code blocks as they should be rendered as-is
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
            const innerContent = part.slice(3, -3).trim();
            const firstNewLineIndex = innerContent.indexOf('\n');

            let language = '';
            let code = innerContent;

            if (firstNewLineIndex !== -1) {
                const possibleLanguage = innerContent.slice(0, firstNewLineIndex).trim();
                if (possibleLanguage.length < 20 && !possibleLanguage.includes(' ')) {
                    language = possibleLanguage;
                    code = innerContent.slice(firstNewLineIndex + 1).trim();
                }
            }

            return <CodeBlock key={index} code={code} language={language} />;
        }

        // Phase 2: Handle regular text split by blocks (images, paragraphs, etc.)
        const blockParts = part.split(/(!\[.*?\]\(.*?\))/g);

        const renderFormattedText = (text: string) => {
            const formattedParts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
            return formattedParts.filter(Boolean).map((subPart, subIndex) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={subIndex}>{subPart.slice(2, -2)}</strong>;
                }
                if (subPart.startsWith('*') && subPart.endsWith('*')) {
                    return <em key={subIndex}>{subPart.slice(1, -1)}</em>;
                }
                if (subPart.startsWith('[') && subPart.includes('](')) {
                    const match = subPart.match(/\[(.*?)\]\((.*?)\)/);
                    if (match) {
                        return <a key={subIndex} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{match[1]}</a>;
                    }
                }
                return subPart;
            });
        };

        return blockParts.filter(Boolean).map((block, blockIndex) => {
            const blockKey = `${index}-${blockIndex}`;

            // If it's a markdown image, render it as a block
            if (block.startsWith('![') && block.includes('](')) {
                const match = block.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) {
                    const altContent = match[1];
                    const imageUrl = match[2];

                    // Parse width if present: ![Alt|75](url)
                    let displayWidth = '100%';
                    let cleanAlt = altContent;

                    if (altContent.includes('|')) {
                        const parts = altContent.split('|');
                        const widthStr = parts[parts.length - 1];
                        if (!isNaN(parseInt(widthStr))) {
                            displayWidth = `${widthStr}%`;
                            cleanAlt = parts.slice(0, -1).join('|');
                        }
                    }

                    return (
                        <div
                            key={blockKey}
                            className="my-6 rounded-2xl overflow-hidden border border-border bg-muted/5 shadow-sm group mx-auto"
                            style={{ width: displayWidth }}
                        >
                            <img
                                src={imageUrl}
                                alt={cleanAlt}
                                className="w-full h-auto object-cover max-h-[800px] hover:scale-[1.01] transition-transform duration-500"
                            />
                            {cleanAlt && cleanAlt !== 'Ảnh' && cleanAlt !== 'Mô tả ảnh' && (
                                <div className="px-4 py-2 text-[11px] text-muted-foreground italic border-t border-border/10 bg-muted/5 text-center">
                                    {cleanAlt}
                                </div>
                            )}
                        </div>
                    );
                }
            }

            // Otherwise, handle regular text line by line
            const lines = block.split('\n');
            let currentAlert: { type: string; lines: string[] } | null = null;
            let currentBlockquote: string[] | null = null;
            let result: React.ReactNode[] = [];

            const pushAccumulated = (lineKey: string) => {
                if (currentAlert) {
                    const { type, lines } = currentAlert;
                    const alertStyles: Record<string, any> = {
                        NOTE: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-900', label: 'Lưu ý' },
                        TIP: { icon: Lightbulb, color: 'text-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900', label: 'Gợi ý' },
                        IMPORTANT: { icon: MessageCircle, color: 'text-purple-500', bg: 'bg-purple-50/50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-900', label: 'Quan trọng' },
                        WARNING: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900', label: 'Cảnh báo' },
                        CAUTION: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50/50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-900', label: 'Thận trọng' }
                    };
                    const style = alertStyles[type] || alertStyles.NOTE;
                    const Icon = style.icon;

                    result.push(
                        <div key={`alert-${lineKey}`} className={`my-6 p-4 rounded-xl border-l-4 ${style.bg} ${style.border} shadow-sm`}>
                            <div className={`flex items-center gap-2 mb-2 font-bold text-sm uppercase tracking-wider ${style.color}`}>
                                <Icon className="w-4 h-4" />
                                {style.label}
                            </div>
                            <div className="text-foreground/90 leading-relaxed italic">
                                {lines.map((l, i) => <p key={i}>{renderFormattedText(l)}</p>)}
                            </div>
                        </div>
                    );
                    currentAlert = null;
                }
                if (currentBlockquote) {
                    result.push(
                        <blockquote key={`quote-${lineKey}`} className="border-l-4 border-primary/30 pl-6 my-6 italic text-foreground/80 leading-relaxed font-serif">
                            {currentBlockquote.map((l, i) => <p key={i}>{renderFormattedText(l)}</p>)}
                        </blockquote>
                    );
                    currentBlockquote = null;
                }
            };

            lines.forEach((line, lineIndex) => {
                const key = `${blockKey}-${lineIndex}`;

                // Check for Alerts
                if (line.startsWith('> [!')) {
                    const match = line.match(/^> \[!(.*?)\]/);
                    if (match) {
                        pushAccumulated(key);
                        currentAlert = { type: match[1], lines: [] };
                        return;
                    }
                }

                // Check for Blockquotes
                if (line.startsWith('> ')) {
                    if (currentAlert) {
                        currentAlert.lines.push(line.replace('> ', ''));
                        return;
                    }
                    if (!currentBlockquote) {
                        pushAccumulated(key);
                        currentBlockquote = [];
                    }
                    currentBlockquote.push(line.replace('> ', ''));
                    return;
                }

                // If not a quote/alert line, push any accumulated ones
                pushAccumulated(key);

                // Horizontal Rules
                if (line === '---' || line === '***') {
                    result.push(<hr key={key} className="my-10 border-border/60" />);
                    return;
                }

                // Headings
                if (line.startsWith('# ')) {
                    const title = line.replace('# ', '').trim();
                    const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    result.push(<h1 key={key} id={id} className="text-3xl font-bold mt-12 mb-6 group flex items-center gap-2">
                        <span className="text-primary/20">#</span> {title}
                    </h1>);
                    return;
                }
                if (line.startsWith('## ')) {
                    const title = line.replace('## ', '').trim();
                    const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    result.push(<h2 key={key} id={id} className="text-2xl font-bold mt-10 mb-5 pb-2 border-b border-border/40 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full" /> {title}
                    </h2>);
                    return;
                }
                if (line.startsWith('### ')) {
                    const title = line.replace('### ', '').trim();
                    const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    result.push(<h3 key={key} id={id} className="text-xl font-bold mt-8 mb-4">{title}</h3>);
                    return;
                }

                // Lists (Basic)
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    result.push(
                        <div key={key} className="flex gap-3 mb-2 pl-4">
                            <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <div className="flex-1 leading-relaxed">{renderFormattedText(line.trim().slice(2))}</div>
                        </div>
                    );
                    return;
                }

                if (line.trim() === '') {
                    result.push(<div key={key} className="h-4" />);
                    return;
                }

                result.push(
                    <p key={key} className="mb-4 last:mb-0 leading-relaxed text-[16px] text-foreground/90">
                        {renderFormattedText(line)}
                    </p>
                );
            });

            pushAccumulated('final');
            return result;
        });
    });
};

const ContentRenderer: React.FC<ContentRendererProps> = ({ content, className = "" }) => {
    return (
        <div className={`prose-custom max-w-none ${className}`}>
            {renderContent(content)}
        </div>
    );
};

export default ContentRenderer;
