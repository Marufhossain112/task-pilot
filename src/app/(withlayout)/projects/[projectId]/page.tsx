"use client";
import { Badge, Button, Card, Checkbox, Col, Row, message } from 'antd';
import { MoreOutlined } from "@ant-design/icons";
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserOutlined, CheckCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useState } from 'react';
import type { CheckboxProps, MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { BACKEND_URL } from '@/Utils/url';
import Loading from '@/app/loading';
import { deleteTaskFn, markAsCompleteTaskFn, editTaskFn, createTaskFn } from '@/Utils/api';


const DynamicProjectPage = () => {
    const router = useRouter();
    const [taskId, setTaskId] = useState<string>("");
    const queryClient = useQueryClient();
    const { projectId } = useParams();

    // mutation for mask as complete
    const {
        mutate: markAsCompleteMutate
    } = useMutation({
        mutationFn: markAsCompleteTaskFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (data.success === true) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },
    });

    // mutation for task delete
    const {
        mutate: taskDeleteMutate
    } = useMutation({
        mutationFn: deleteTaskFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (data.success === true) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },
    });

    // mutation for task edit
    const {
        mutate: editTaskMutate
    } = useMutation({
        mutationFn: editTaskFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (data.success === true) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },
    });



    const onChange: CheckboxProps['onChange'] = (task_id) => {
        markAsCompleteMutate(task_id as unknown as string);
    };

    // handle task deletion
    const handleDeleteTask = (task_id: string) => {
        // console.log("see task id🥳", task_id);
        taskDeleteMutate(task_id);
    };


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Edit
                </span>
            ),
        },

        {
            key: '2',
            label: (
                <span className='text-red-700' onClick={() => handleDeleteTask(taskId)}>
                    Delete
                </span>

            ),
        },


    ];

    const { data: projectTasksData, isLoading } = useQuery(
        {
            queryKey: ['tasks'],
            queryFn: async () => {
                const response = await fetch(`${BACKEND_URL}/tasks?project=${projectId}`);
                const data = await response.json();
                return data;
            }
        });

    // console.log("get tasks by project🤘", projectTasksData);

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
                                    <span className='flex gap-2 items-center'>
                                        <span>{task?.title}</span>
                                        {
                                            task?.isComplete === true && <CheckCircleOutlined />
                                        }

                                    </span>
                                    <Dropdown trigger={["click"]} menu={{ items }} placement="topLeft">
                                        <MoreOutlined onClick={() => setTaskId(task?._id)} />
                                    </Dropdown>

                                </div>
                            } bordered={false} >
                                {/* <span className='mb-2'>{task?.status}</span> */}
                                <div className='flex justify-between'>
                                    <Badge
                                        className="site-badge-count-109"
                                        count={task?.status}
                                        style={{ backgroundColor: '#52c41a' }}
                                    />
                                    {
                                        task?.isComplete === false && <span className='flex gap-1'>
                                            <span>Mark as complete</span>
                                            <Checkbox onChange={() => onChange(task?._id)} />
                                        </span>
                                    }

                                </div>

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
            <Button onClick={() => router.push(`/projects/${projectId}/tasks/create`)}>Add New Task</Button>
        </div>

    );
};

export default DynamicProjectPage;
