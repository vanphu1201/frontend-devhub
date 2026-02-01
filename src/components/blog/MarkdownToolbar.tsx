import React from 'react';
import {
    Bold,
    Italic,
    List,
    Type,
    Link,
    Image as ImageIcon,
    Code,
    Quote,
    Minus,
    Heading1,
    Heading2,
    Heading3,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkdownToolbarProps {
    textareaId: string;
    onInsert: (text: string, selectionOffset?: number, length?: number) => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ textareaId, onInsert }) => {
    const insertFormatting = (prefix: string, suffix: string = '', defaultValue: string = '') => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const textToInsert = prefix + (selectedText || defaultValue) + suffix;

        onInsert(textToInsert, prefix.length, (selectedText || defaultValue).length);

        // Focus back to textarea
        setTimeout(() => {
            textarea.focus();
            const newPos = start + prefix.length + (selectedText || defaultValue).length + suffix.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const tools = [
        { icon: Heading1, label: 'Heading 1', action: () => insertFormatting('# ', '\n') },
        { icon: Heading2, label: 'Heading 2', action: () => insertFormatting('## ', '\n') },
        { icon: Heading3, label: 'Heading 3', action: () => insertFormatting('### ', '\n') },
        { type: 'separator' },
        { icon: Bold, label: 'Bold', action: () => insertFormatting('**', '**', 'văn bản đậm') },
        { icon: Italic, label: 'Italic', action: () => insertFormatting('*', '*', 'văn bản nghiêng') },
        { type: 'separator' },
        { icon: List, label: 'Bullet List', action: () => insertFormatting('- ', '', 'mục danh sách') },
        { icon: Quote, label: 'Blockquote', action: () => insertFormatting('> ', '', 'trích dẫn') },
        { icon: AlertCircle, label: 'Alert/Note', action: () => insertFormatting('> [!NOTE]\n> ', '', 'nội dung lưu ý') },
        { type: 'separator' },
        { icon: Link, label: 'Link', action: () => insertFormatting('[', '](https://example.com)', 'tên liên kết') },
        { icon: ImageIcon, label: 'Image', action: () => insertFormatting('![', '](hình_ảnh_url)', 'mô tả ảnh') },
        { icon: Code, label: 'Code Inline', action: () => insertFormatting('`', '`', 'code') },
        { icon: Code, label: 'Code Block', action: () => insertFormatting('```javascript\n', '\n```', 'console.log("Hello");') },
        { icon: Minus, label: 'Horizontal Rule', action: () => insertFormatting('\n---\n') },
    ];

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-border/60">
                {tools.map((tool, index) => {
                    if (tool.type === 'separator') {
                        return <div key={index} className="w-[1px] h-6 bg-border/60 mx-1" />;
                    }
                    const Icon = tool.icon as any;
                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-background hover:text-primary transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        tool.action?.();
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-wider">
                                {tool.label}
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
};

export default MarkdownToolbar;
