"use client";
import { Layout } from "antd";

const { Content } = Layout;

const Contents = ({ children }: { children: React.ReactNode; }) => {
  const base = "admin";
  return (
    <Content
      style={{
        minHeight: "100vh",
        color: "black",
      }}
    >
      {children}
    </Content>
  );
};

export default Contents;
