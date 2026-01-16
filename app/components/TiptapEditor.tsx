"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link2,
  Unlink,
  FileCode,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "เริ่มเขียนบทความของคุณ...",
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 hover:text-blue-300 hover:underline",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-invert max-w-none focus:outline-none min-h-[400px] p-4 text-white [&_.is-editor-empty]:before:text-gray-400 [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:pointer-events-none [&_.is-editor-empty]:before:h-0",
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/articles/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertHtml = useCallback(() => {
    if (!editor || !htmlCode.trim()) return;
    
    // Insert HTML directly into the editor
    editor.commands.setContent(htmlCode);
    onChange(htmlCode);
    
    // Close modal and reset
    setShowHtmlModal(false);
    setHtmlCode("");
  }, [editor, htmlCode, onChange]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-900/50">
      <style dangerouslySetInnerHTML={{
        __html: `
          .ProseMirror {
            color: white !important;
          }
          .ProseMirror p,
          .ProseMirror h1,
          .ProseMirror h2,
          .ProseMirror h3,
          .ProseMirror h4,
          .ProseMirror h5,
          .ProseMirror h6,
          .ProseMirror li,
          .ProseMirror span,
          .ProseMirror strong,
          .ProseMirror em,
          .ProseMirror ul,
          .ProseMirror ol {
            color: white !important;
          }
          .ProseMirror code {
            background-color: rgb(30 41 59) !important;
            color: rgb(244 114 182) !important;
          }
          .ProseMirror pre {
            background-color: rgb(30 41 59) !important;
          }
          .ProseMirror blockquote {
            color: rgb(209 213 219) !important;
          }
        `
      }} />
      {/* Toolbar */}
      <div className="bg-slate-800 border-b border-slate-600 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("bold") ? "bg-slate-600 text-white" : ""
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("italic") ? "bg-slate-600 text-white" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("strike") ? "bg-slate-600 text-white" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("code") ? "bg-slate-600 text-white" : ""
          }`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("heading", { level: 1 }) ? "bg-slate-600 text-white" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("heading", { level: 2 }) ? "bg-slate-600 text-white" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("heading", { level: 3 }) ? "bg-slate-600 text-white" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("bulletList") ? "bg-slate-600 text-white" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("orderedList") ? "bg-slate-600 text-white" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Quote and Code Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("blockquote") ? "bg-slate-600 text-white" : ""
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white ${
            editor.isActive("link") ? "bg-slate-600 text-white" : ""
          }`}
          title="Add Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
          title="Remove Link"
        >
          <Unlink className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Image */}
        <button
          type="button"
          onClick={handleImageUpload}
          className="p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Insert HTML */}
        <button
          type="button"
          onClick={() => setShowHtmlModal(true)}
          className="p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white"
          title="Insert HTML"
        >
          <FileCode className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded text-gray-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* HTML Insert Modal */}
      {showHtmlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Insert HTML</h3>
              <p className="text-sm text-gray-600 mt-1">
                วาง HTML code ของคุณด้านล่าง (จะแทนที่เนื้อหาทั้งหมด)
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="<h1>หัวข้อของคุณ</h1>&#10;<p>เนื้อหาของคุณ...</p>"
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowHtmlModal(false);
                  setHtmlCode("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={insertHtml}
                disabled={!htmlCode.trim()}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
