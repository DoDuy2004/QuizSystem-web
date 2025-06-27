import React, { useCallback, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
// import { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const quillRef = useRef<any>(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code-block"],
        ["link"],
        ["clean"],
      ],
      //   handlers: { image: imageHandler },
    },
    clipboard: { matchVisual: false },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "code-block",
  ];

  useEffect(() => {
    if (quillRef.current) {
      const quillContainer = quillRef.current.getEditor().container;
      quillContainer.style.minHeight = "100px"; // Tăng chiều cao
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder="Soạn câu hỏi tại đây..."
      style={{
        minHeight: "150px",
        width: "100%",
        borderRadius: "0.375rem",
      }}
    />
  );
}

export default RichTextEditor;
