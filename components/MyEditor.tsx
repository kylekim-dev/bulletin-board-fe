import React, { useState, useEffect } from "react";
// import ReactQuill from 'react-quill'

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
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
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

export default function MyEditor(){
    const [content, setContent] = useState<string>('')
    const handleChange = (value: string) => {
        setContent(value)
    }
    return (
        <div>
        <QuillNoSSRWrapper
            theme="snow"
            modules={modules}
            formats={formats}
            value={content}
            onChange={handleChange}
        />
        {content}
        </div>
    )
}

// const MyEditor = () => {
//     const [content, setContent] = useState<string>('')
//     const handleChange = (value: string) => {
//       setContent(value)
//     }
//     return (
//         <div>
//         <QuillNoSSRWrapper
//           theme="snow"
//           modules={modules}
//           value={content}
//           onChange={handleChange}
//         />
//         {content}
//         </div>
//     )
//   }
  

//   export default MyEditor;
  
  
  
  