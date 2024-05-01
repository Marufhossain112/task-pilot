"use client";
import { Button, Col, Row, message } from "antd";
import loginImage from "@/app/assets/login-bro.png";
import Image from "next/image";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import {
  useMutation, QueryClient
} from '@tanstack/react-query';
import { loginFn } from "@/Utils/api";
import { useRouter } from "next/navigation";

type FormValues = {
  username: string;
  password: string;
};
const queryClient = new QueryClient();

const LoginPage = () => {
  const router = useRouter();
  const { data: loginDataRes,
    mutate,
    isPending,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      if (data.success === true) {
        message.success(data.message);
        router.push('/projects');
      } else {
        message.error(data.message);
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate(data);
  };
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
      }}
    >
      <Col sm={12} md={16} lg={10}>
        <Image src={loginImage} width={500} alt="login image" />
      </Col>
      <Col sm={12} md={8} lg={8}>
        <h1
          style={{
            margin: "15px 0px",
            fontWeight: 700,
            fontSize: '25px'
          }}
        >
          Login your account
        </h1>
        <div>
          <Form submitHandler={onSubmit}>
            <div>
              <FormInput name="username" type="text" size="large" label="Username" />
            </div>
            <div
              style={{
                margin: "15px 0px",
              }}
            >
              <FormInput
                name="password"
                type="password"
                size="large"
                label="Password"
              />
            </div>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
