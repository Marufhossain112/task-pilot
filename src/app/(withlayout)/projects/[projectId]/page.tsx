"use client";
import { Badge, Button, Card, Checkbox, Select, message } from 'antd';
import { MoreOutlined } from "@ant-design/icons";
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import type { CheckboxProps, MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { BACKEND_URL } from '@/Utils/url';
import Loading from '@/app/loading';
import { deleteTaskFn, markAsCompleteTaskFn, editTaskFn } from '@/Utils/api';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { SubmitHandler } from 'react-hook-form';
import FormDatePicker from '@/components/UI/FormDatePicker';


const DynamicProjectPage = () => {
    const router = useRouter();
    const [taskId, setTaskId] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [due_date, setDueDate] = useState<string>("");
    const [assignee, setAssignee] = useState<string>("");
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
                <span onClick={() => router.push(`/tasks/edit/${taskId}`)}>
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
    let filterUrl: string;
    if (status) {
        filterUrl = `status=${status}`;
    } else if (due_date) {
        filterUrl = `due_date=${due_date}`;
    } else if (assignee) {
        filterUrl = `assigned_to=${assignee}`;
    }
    // console.log("filterurl🚀", filterUrl);
    const { data: projectTasksData, isLoading, refetch } = useQuery(
        {
            queryKey: ['tasks'],
            queryFn: async () => {
                const response = await fetch(`${BACKEND_URL}/tasks?project=${projectId}&searchTerm=${search}&${filterUrl}`);
                const data = await response.json();
                return data;
            }
        });

    // console.log("get tasks by project🤘", projectTasksData);
    useEffect(() => {
        refetch();
    }, [search, refetch, status, due_date, assignee]);

    if (isLoading) {
        return <Loading />;
    }
    type FormValues = {
        searchTerm: string;
    };
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setSearch(data?.searchTerm);
    };
    const handleStatusChange = (value: string) => {
        // console.log("selected value", value);
        setStatus(value);
    };
    const onDueSubmit: SubmitHandler<{ due_date: string; }> = (data: any) => {
        const dueDateData = {
            due_date: data?.due_date?.$D + "/" + data?.due_date?.$M + "/" + data?.due_date?.$y,
        };
        setDueDate(dueDateData?.due_date);
        // console.log("due data", dueDateData);

    };
    const assigneeSubmit: SubmitHandler<{ assigned_to: string; }> = (data) => {
        setAssignee(data?.assigned_to);
        // console.log("assignee data", data);
    };
    // console.log('search data🍘', search);
    return (
        <div className='mx-[1%] mt-5'>
            <h1 className="text-xl font-bold ml-2 mb-4">All Tasks</h1>
            <div >
                <div className='flex flex-col items-center justify-between'>
                    <div >    <Form submitHandler={onSubmit}>
                        <div className='flex items-center gap-2  mb-5'>
                            <FormInput name="searchTerm" placeholder='Search here..' type="text" size="large" />
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </div>
                    </Form>
                    </div>

                    <div >    <div className='flex  flex-col md:flex-row items-center gap-4'>
                        <div>
                            {/* Status : {" "} */}
                            <Select
                            className='py-2'
                                showSearch
                                onChange={(e) => handleStatusChange(e)}
                                style={{ width: 200 }}
                                placeholder="Filter By Status"
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

                        </div>
                        <div>

                            <Form submitHandler={onDueSubmit}>
                                <div className='flex gap-1 items-center'>
                                    <div >
                                        <div

                                            style={{
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <FormDatePicker
                                                name="due_date"
                                                label="Due Date"
                                                size="large"
                                            />
                                        </div>
                                    </div>
                                    <Button type='primary' htmlType='submit'>Filter</Button>
                                </div>
                            </Form>
                        </div>
                        <div>

                            <Form submitHandler={assigneeSubmit}>
                                <div className='flex gap-1 items-center'>
                                    <div >
                                        <div
                                            style={{
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <FormInput
                                                name="assigned_to"
                                                label="Assignee"
                                                size="large"
                                                placeholder='Search by assignee name'
                                            />
                                        </div>
                                    </div>
                                    <Button type='primary' htmlType='submit'>Filter</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            {
                projectTasksData?.data.length === 0 && <p className='ml-2'>No tasks found</p>
            }
            <div>
                <div className='grid md:grid-cols-3 gap-4 grid-cols-1'>
                    {
                        projectTasksData?.data?.map((task: any) => (
                            <div key={task?._id}>
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
                            </div>
                        ))
                    }


                </div>
            </div>

            <Button onClick={() => router.push(`/projects/${projectId}/tasks/create`)}>Add New Task</Button>
        </div>

    );
};

export default DynamicProjectPage;
