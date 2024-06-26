import { Avatar, Button, Dropdown, Layout, MenuProps, Row, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
const { Header: AntHeader } = Layout;

const Header = () => {
    const router = useRouter();

    const logOut = () => {
        router.push("/login");
    };

    const items: MenuProps["items"] = [
        {
            key: "0",
            label: (
                <Button onClick={logOut} type="text" danger>
                    Logout
                </Button>
            ),
        },
    ];
    return (
        <AntHeader
            style={{
                background: "#85919c",
            }}
        >
            <Row
                justify="end"
                align="middle"
                style={{
                    height: "100%",
                }}
            >
                <p
                    style={{
                        margin: "0px 5px",
                    }}
                >
                    John Doe
                </p>
                <Dropdown menu={{ items }}>
                    <a>
                        <Space wrap size={16}>
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                    </a>
                </Dropdown>
            </Row>
        </AntHeader>
    );
};

export default Header;
