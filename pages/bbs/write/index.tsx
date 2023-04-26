import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { Content } from "@/src/types";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import {
  startLoading,
  endLoading,
  openDialog,
  openSnackbar,
} from "@/slices/globalSlice";
import { AxiosRequestConfig } from "axios";
import { StrApiHelper } from "@/src/classes/StrApiHelper";
import { getCookie } from "cookies-next";

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

const current = new Date();

const initContent: Content = {
  id: 0,
  title: "",
  category: "",
  body: "",
  createdAt: current,
  publishedAt: current,
  updatedAt: current,
};

export default function Write() {
  const dispatch = useDispatch();
  const [content, setContent] = useState<Content>(initContent);
  const handleChange = (value: string) => {
    setContent((content) => ({ ...content, body: value }));
  };

  const onSubmit = async (model: Content) => {
    dispatch(startLoading());

    try {
      if (!model.title) {
        throw new Error("제목을 입력해주세요.");
      }

      if (!model.category) {
        throw new Error("카테고리를 입력해주세요.");
      }

      const api = new StrApiHelper(`${process.env.PUBLIC_API_URL}`);
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      };
      console.log(model);
      const resp = await api.post<any>(`api/bulletin-boards`, model, config);

      console.log(resp);
    } catch (ex) {
      if(ex instanceof Error){
        dispatch(
          openDialog({
            status: "error",
            error: ex.message,
            title: "Error",
          })
        );
      }
      else {
        console.error(ex);
      }
    }

    dispatch(endLoading());
  };

  return (
    <div>
      <Container>
        <form>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                id="category"
                label="글쓴이"
                variant="standard"
                value={"Starlight12"}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="category"
                label="Category"
                variant="standard"
                value={content.category}
                onChange={(e) =>
                  setContent((content) => ({
                    ...content,
                    category: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="title"
                label="Title"
                variant="standard"
                value={content.title}
                fullWidth
                onChange={(e) =>
                  setContent((content) => ({
                    ...content,
                    title: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ my: 2 }}>
                <Editor
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={content.body}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => onSubmit(content)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
}
