import type { MenuProps } from "antd";
import {
    ProjectOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export const sidebarItems = () => {
    const defaultSidebarItems: MenuProps["items"] = [
        {
            label: <Link href={`/projects`}>Projects</Link>,
            key: `/projects`,
            icon: <ProjectOutlined />
        },
    ];

    return defaultSidebarItems;

};
