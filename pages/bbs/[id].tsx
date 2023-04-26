import React, { useState, useEffect } from "react";
import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link, Divider } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";
import { Content } from "@/src/types";
import { ApiHelper } from "@/src/classes/ApiHelper";
import { AxiosRequestConfig } from "axios";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies["token"]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const api = new ApiHelper(`${process.env.PUBLIC_API_URL}`);
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${context.req.cookies["token"]}`,
    },
  };

  const resp = await api.get<any>(
    `api/bulletin-boards/${context.params?.id}`,
    config
  );
  const content: Content = resp.data.attributes;
  content.id = resp.data.id;

  return {
    props: {
      content,
    },
  };
};

export default function BBSDetails({ content }: { content: Content }) {
  return (
    <div>
      <Container>
        <div>{content.title}</div>
        <div>
          글쓴이: AAA | 등록일: 02/03/2019 13:00 | 조회수: 33 | 추천수: 0
        </div>
        <Divider />
        <Box minHeight={300}>
          <div dangerouslySetInnerHTML={{ __html: content?.body ?? "" }}></div>
        </Box>
        <Divider />
        <Box>
          <div>아이디1</div>
          <div>
            기업의 목표를 달성하기 위해 통제 가능한 마케팅 변수는 크게
            제품(Product), 가격(Price), 유통 경로(Place), 판매 촉진(Promotion)이
            있으며, 이 네 가지를 흔히 4P라고 한다. 이러한 통제 변수를 적절히
            배합하여 목적을 이루어내는 전략을 마케팅 믹스라고 부른다. 제품:
            제품의 관리는 브랜드의 관리와 제품의 수명 주기 등을 고려해야 한다.
            가격: 가격의 관리는 제품의 시장 도입 시 가격 수준에 대한 고려, 경쟁
            상품의 가격에 대한 대응 전략, 가격 결정에 영향을 주는 요인에 대한
            고려 등이 있다. 가격 정책은 소비자가 가장 민감하고 신속하게 반응하여
            즉각적인 효과를 가져온다. 유통 경로: 유통경로의 관리는 제조사가
            소매점을 최대한 많이 확보하는 전략을 취할지 특화된 전문점을
            소매점으로 택할지 등을 결정한다. 판매 촉진: 소비자의 구매를
            유도하도록 자사의 제품이나 서비스를 어필하는 것으로 대표적으로 광고,
            판매촉진, PR, 인적판매 등이 있다.
          </div>
          <div>03/01/2022 11:11 / 좋아요 / 대댓글</div>
        </Box>
      </Container>
    </div>
  );
}
