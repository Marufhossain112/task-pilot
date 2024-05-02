"use client";
import { Badge, Card, Col, Row } from 'antd';
import { MoreOutlined } from "@ant-design/icons";
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';
import { BACKEND_URL } from '@/Utils/url';
import Loading from '@/app/loading';



const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                Edit
            </a>
        ),
    },

    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Mark as complete
            </a>
        ),
    },

    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                <span className='text-red-700'>
                    Delete
                </span>
            </a>
        ),
    },


];


const DynamicProjectPage = () => {
    const queryClient = useQueryClient();
    const { projectId } = useParams();

    const { data: projectTasksData, isLoading } = useQuery(
        {
            queryKey: ['tasks'],
            queryFn: async () => {
                const response = await fetch(`${BACKEND_URL}/tasks?project=${projectId}`);
                const data = await response.json();
                return data;
            }
        });

    console.log("get tasks by project🤘", projectTasksData);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='mx-[1%] mt-5'>
            <h1 className="text-xl font-bold ml-2 mb-4">All Tasks</h1>
            {
                projectTasksData?.data.length === 0 && <p className='ml-2'>No tasks found</p>
            }
            <Row gutter={16} >
                {
                    projectTasksData?.data?.map((task: any) => (
                        <Col sm={8} key={task?._id}>
                            <Card title={
                                <div className="flex items-center justify-between">
                                    <span>{task?.title}</span>
                                    <Dropdown menu={{ items }} placement="topLeft">
                                        <MoreOutlined />
                                    </Dropdown>
                                </div>
                            } bordered={false} >
                                {/* <span className='mb-2'>{task?.status}</span> */}
                                <Badge
                                    className="site-badge-count-109"
                                    count={task?.status}
                                    style={{ backgroundColor: '#52c41a' }}
                                />
                                <p className='mt-2'>
                                    {task?.description}
                                </p>

                                <div className='mt-2'>
                                    <p className='text-gray-700 font-medium'>Due on : {task?.due_date}</p>
                                </div>
                                <div className='mt-2'>
                                    <ul className='text-gray-700 font-medium'> <span className='font-semibold text-gray-800'>Assignee :</span>  {task?.assigned_to?.map((person: string, index: number) => <li key={index}>{person}</li>)}</ul>
                                </div>
                            </Card>
                            <div className='mt-4' />
                        </Col>
                    ))
                }


            </Row>
        </div>

    );
};

export default DynamicProjectPage;
