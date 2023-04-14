import React, { useState } from "react";
import { Container, TextField, Button } from "@mui/material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const Editor = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

interface Temp {
  id: number;
  title: string;
  category: string;
  body: string;
}

const initContent: Temp = {
  id: 0,
  title: "",
  category: "",
  body: "",
};

export default function Content() {
  const [content, setContent] = useState<Temp>(initContent);
  const handleChange = (value: string) => {
    setContent((content) => ({ ...content, body: value }));
  };

  const onSubmit = () => {
    if (!!content.body) {
      const contentsJSON = localStorage.getItem("contents123") ?? "[]";
      const contents = JSON.parse(contentsJSON);
      content.id = Math.floor(Math.random() * 100);
      contents.push(content);
      localStorage.setItem("contents123", JSON.stringify(contents));
      setContent(initContent);
    }
  };

  return (
    <div>
      <Container>
        <TextField
          id="title"
          label="Title"
          variant="standard"
          value={content.title}
          fullWidth
          onChange={(e) =>
            setContent((content) => ({ ...content, title: e.target.value }))
          }
        />
        <TextField
          id="category"
          label="Category"
          variant="standard"
          value={content.category}
          onChange={(e) =>
            setContent((content) => ({ ...content, category: e.target.value }))
          }
        />
        <Editor
          theme="snow"
          modules={modules}
          formats={formats}
          value={content.body}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={onSubmit}>
          Save
        </Button>

        <div dangerouslySetInnerHTML={{ __html: content.body }}></div>
      </Container>
    </div>
  );
}
