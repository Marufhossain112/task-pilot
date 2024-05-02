"use client";
import { editTaskFn, getUsersFn } from '@/Utils/api';
import { BACKEND_URL } from '@/Utils/url';
import Loading from '@/app/loading';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import FormDatePicker from '@/components/UI/FormDatePicker';
import FormMultiSelectField, { SelectOptions } from '@/components/UI/FormMultiSelectField';
import FormTextArea from '@/components/UI/FormTextArea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Row, Select, message } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

type FormValues = any;

const TaskEditPage = () => {
    const [status, setStatus] = useState<string>("");
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const { taskId } = useParams();

    const queryClient = useQueryClient();

    // // mutation for task creation
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


    const { data: usersData, isLoading: userLoading } = useQuery(
        {
            queryKey: ['users'],
            queryFn: getUsersFn
        });
    const { data: taskData, isLoading } = useQuery(
        {
            queryKey: ['tasks'],
            queryFn: async () => {
                const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
                    method: "GET"
                });
                const data = await response.json();
                return data;
            }
        });
    // console.log("see task data 🚀", taskData?.data?.title);
    const coursesOptions = usersData?.data?.map((user: any) => {
        return {
            label: user?.firstName,
            value: user?.firstName,
        };
    });
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("data", data);
        const editTaskData = {
            title: data?.title,
            description: data?.description,
            due_date: data?.due_date?.$D + "/" + data?.due_date?.$M + "/" + data?.due_date?.$y,
            assigned_to: data?.assigned_to,
            status,
            isComplete
        };
        // console.log(createTaskData);
        const updateData = {
            taskId,
            updateTaskData: editTaskData
        };
        // @ts-ignore
        editTaskMutate(updateData);
    };

    const handleStatusChange = (value: string) => {
        // console.log("selected value", value);
        setStatus(value);
    };
    const handleIsCompleteChange = (value: boolean) => {
        console.log("selected value", value);
        setIsComplete(value);
    };


    if (isLoading || userLoading) {
        return <Loading />;
    }
    return (
        <div>
            <Form submitHandler={onSubmit} >
                <div
                    style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "5px",
                        padding: "15px",
                        marginBottom: "10px",
                    }}
                >
                    <p
                        style={{
                            fontSize: "18px",
                            marginBottom: "10px",
                        }}
                    >
                        Edit Task
                    </p>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

                        <Col
                            className="gutter-row"
                            span={8}
                            style={{
                                marginBottom: "10px",
                            }}
                        >
                            <FormInput
                                type="text"
                                name="title"
                                size="large"
                                label="Title"
                                defaultValue={taskData?.data?.title}
                            />
                        </Col>

                        <Col
                            className="gutter-row"
                            span={8}
                            style={{
                                marginBottom: "10px",
                            }}
                        >
                            <FormDatePicker
                                name="due_date"
                                label="Due Date"
                                size="large"
                            />
                        </Col>
                        <Col
                            className="gutter-row"
                            span={8}
                            style={{
                                marginBottom: "10px",
                            }}
                        >

                            <FormMultiSelectField
                                name="assigned_to"
                                label="Assignee"
                                options={coursesOptions as SelectOptions[]}
                            />
                        </Col>


                        <Col span={12} style={{ margin: "0px 0" }}>
                            <FormTextArea
                                name="description"
                                label="Description"
                                defaultValue={taskData?.data?.description}
                                rows={6}
                            />
                        </Col>
                        <Col span={6} style={{ margin: "0px 0" }}>
                            Status <br />
                            <Select
                                className='py-2'
                                showSearch
                                onChange={(e) => handleStatusChange(e)}
                                style={{ width: 200 }}
                                placeholder="Update Status"
                                defaultValue={taskData?.data?.status}
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'Do',
                                        label: 'Do',
                                    },
                                    {
                                        value: 'In Progress',
                                        label: 'In Progress',
                                    },
                                    {
                                        value: 'Done',
                                        label: 'Done',
                                    }
                                ]}
                            />
                        </Col>

                        <Col span={6} style={{ margin: "0px 0" }}>
                            Is Complete <br />
                            <Select
                                className='py-2'
                                showSearch
                                onChange={(e) => handleIsCompleteChange(e)}
                                style={{ width: 200 }}
                                defaultValue={taskData?.data?.isComplete}
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[
                                    {
                                        value: true,
                                        label: 'True',
                                    },
                                    {
                                        value: false,
                                        label: 'False',
                                    },

                                ]}
                            />
                        </Col>




                    </Row>
                </div>


                <Button htmlType="submit" type="primary" className='ml-5'>
                    Edit
                </Button>
            </Form>
        </div>
    );
};

export default TaskEditPage;