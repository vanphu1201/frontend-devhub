import React, { useState, useRef, useEffect } from 'react';
import {
    GripVertical,
    Trash2,
    Plus,
    Image as ImageIcon,
    Type,
    Code,
    MoreHorizontal,
    Move
} from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';

export type EditorBlock =
    | { id: string; type: 'text'; content: string }
    | { id: string; type: 'image'; url: string; width: number; height?: number };

interface VisualBlockEditorProps {
    blocks: EditorBlock[];
    onChange: (blocks: EditorBlock[]) => void;
    onUploadImage: (file: File) => Promise<string>;
    placeholder?: string;
}

const VisualBlockEditor: React.FC<VisualBlockEditorProps> = ({
    blocks,
    onChange,
    onUploadImage,
    placeholder = "Bắt đầu viết hoặc chèn ảnh..."
}) => {
    const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
    const [resizingBlockId, setResizingBlockId] = useState<string | null>(null);
    const [showAddMenu, setShowAddMenu] = useState<string | null>(null); // block id

    const containerRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

    const addBlock = (type: 'text' | 'image' | 'code', afterId?: string) => {
        let newBlock: EditorBlock;

        if (type === 'text') {
            newBlock = { id: Math.random().toString(36).substr(2, 9), type: 'text', content: '' };
        } else if (type === 'code') {
            newBlock = { id: Math.random().toString(36).substr(2, 9), type: 'text', content: '```\n// Nhập code của bạn tại đây\n\n```' };
        } else {
            newBlock = { id: Math.random().toString(36).substr(2, 9), type: 'image', url: '', width: 100 };
        }

        const index = afterId ? blocks.findIndex(b => b.id === afterId) : blocks.length - 1;
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        onChange(newBlocks);
        setShowAddMenu(null);
    };

    const updateBlock = (id: string, updates: Partial<EditorBlock>) => {
        onChange(blocks.map(b => b.id === id ? { ...b, ...updates } as EditorBlock : b));
    };

    const removeBlock = (id: string) => {
        if (blocks.length <= 1 && blocks[0].type === 'text') {
            updateBlock(id, { content: '' });
            return;
        }
        onChange(blocks.filter(b => b.id !== id));
    };

    const handleImageUpload = async (id: string, file: File) => {
        try {
            const url = await onUploadImage(file);
            updateBlock(id, { url });
        } catch (error) {
            toast.error("Lỗi tải ảnh lên");
        }
    };

    const startResizing = (id: string, e: React.MouseEvent, currentWidth: number) => {
        e.preventDefault();
        setResizingBlockId(id);
        resizeRef.current = { startX: e.clientX, startWidth: currentWidth };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (resizingBlockId && resizeRef.current && containerRef.current) {
                const deltaX = e.clientX - resizeRef.current.startX;
                const containerWidth = containerRef.current.offsetWidth;
                const deltaPercent = (deltaX / containerWidth) * 100;

                let newWidth = Math.min(100, Math.max(10, resizeRef.current.startWidth + deltaPercent));
                updateBlock(resizingBlockId, { width: newWidth });
            }
        };

        const handleMouseUp = () => {
            setResizingBlockId(null);
            resizeRef.current = null;
        };

        if (resizingBlockId) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingBlockId, blocks]);

    return (
        <div ref={containerRef} className="space-y-2 py-4">
            {blocks.map((block, index) => (
                <div key={block.id} className="group relative">
                    {/* Add Menu Trigger (Top) */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                            onClick={() => setShowAddMenu(showAddMenu === block.id ? null : block.id)}
                            className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {showAddMenu === block.id && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl shadow-xl p-2 flex gap-2 z-20 animate-in fade-in zoom-in-95">
                            <Button variant="ghost" size="sm" onClick={() => addBlock('text', block.id)} className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-blue-500" /> Văn bản
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => addBlock('code', block.id)} className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-purple-500" /> Mã Code
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => addBlock('image', block.id)} className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-emerald-500" /> Hình ảnh
                            </Button>
                        </div>
                    )}

                    <div className="flex items-start gap-2">
                        {/* Block Actions */}
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 shrink-0">
                            <button className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeBlock(block.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Block Content */}
                        <div className="flex-1 min-w-0">
                            {block.type === 'text' ? (
                                <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                    placeholder={index === 0 ? placeholder : "Tiếp tục viết..."}
                                    className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/50 text-[16px] leading-relaxed py-1 block"
                                    rows={block.content.split('\n').length || 1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey && block.content.trim() === '') {
                                            e.preventDefault();
                                        }
                                        if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
                                            e.preventDefault();
                                            removeBlock(block.id);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="relative group/image my-4">
                                    {!block.url ? (
                                        <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Tải ảnh lên</p>
                                                <p className="text-xs text-muted-foreground">Kéo thả hoặc nhấn để chọn</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(block.id, file);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="relative inline-block overflow-hidden rounded-2xl border border-border transition-all duration-300 shadow-sm"
                                            style={{ width: `${block.width}%` }}
                                        >
                                            <img
                                                src={block.url}
                                                alt="Editor image"
                                                className="w-full h-auto block pointer-events-none"
                                            />

                                            {/* Resize Handles */}
                                            <div
                                                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover/image:opacity-100 bg-primary/20 hover:bg-primary/40 transition-all flex items-center justify-center"
                                                onMouseDown={(e) => startResizing(block.id, e, block.width)}
                                            >
                                                <div className="w-1 h-8 bg-primary rounded-full" />
                                            </div>

                                            {/* Change Image Overlay */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                                <button
                                                    className="bg-background/80 backdrop-blur-sm p-1.5 rounded-lg hover:bg-destructive hover:text-white transition-colors border border-border shadow-sm"
                                                    onClick={() => updateBlock(block.id, { url: '' })}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Markdown Help Legend */}
            <div className="flex flex-wrap gap-4 px-10 py-3 bg-muted/5 rounded-xl border border-border/30 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><span className="text-primary">**</span>Đậm<span className="text-primary">**</span></div>
                <div className="flex items-center gap-1.5"><span className="text-primary">*</span>Nghiêng<span className="text-primary">*</span></div>
                <div className="flex items-center gap-1.5"><span className="text-primary">```</span>Khối Code<span className="text-primary">```</span></div>
                <div className="flex items-center gap-1.5"><span className="text-primary">#</span> Tiêu đề</div>
                <div className="flex items-center gap-1.5"><span className="text-primary">&gt;</span> Trích dẫn</div>
            </div>

            {/* Final Add Menu (Bottom) */}
            <div className="flex justify-center pt-4 opacity-50 hover:opacity-100 transition-opacity gap-4">
                <button
                    onClick={() => addBlock('text')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                    <Plus className="w-4 h-4" /> Thêm nội dung
                </button>
                <button
                    onClick={() => addBlock('code')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-purple-500 transition-colors"
                >
                    <Code className="w-4 h-4" /> Thêm code
                </button>
            </div>
        </div>
    );
};

export default VisualBlockEditor;
