"use client";
import { createTaskFn, getUsersFn } from '@/Utils/api';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import FormDatePicker from '@/components/UI/FormDatePicker';
import FormMultiSelectField, { SelectOptions } from '@/components/UI/FormMultiSelectField';
import FormTextArea from '@/components/UI/FormTextArea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Row, message } from 'antd';
import { useParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';

type FormValues = any;

const TaskCreatePage = () => {
    const { projectId } = useParams();

    const queryClient = useQueryClient();

    // mutation for task creation
    const {
        mutate: createTaskMutate
    } = useMutation({
        mutationFn: createTaskFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (data.success === true) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },
    });


    const { data: usersData, isLoading } = useQuery(
        {
            queryKey: ['users'],
            queryFn: getUsersFn
        });
    // console.log("see usr 🚀",usersData)
    const coursesOptions = usersData?.data?.map((user: any) => {
        return {
            label: user?.firstName,
            value: user?.firstName,
        };
    });
    const onSubmit: SubmitHandler<FormValues> = (data) => {

        const createTaskData = {
            title: data?.title,
            description: data?.description,
            due_date: data?.due_date?.$D + "/" + data?.due_date?.$M + "/" + data?.due_date?.$y,
            assigned_to: data?.assigned_to,
            project: projectId,
        };
        // console.log(createTaskData);
        // @ts-ignore
        createTaskMutate(createTaskData);
    };

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
                        Create Task
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
                                label="Assign Members"
                                options={coursesOptions as SelectOptions[]}
                            />
                        </Col>


                        <Col span={24} style={{ margin: "0px 0" }}>
                            <FormTextArea
                                name="description"
                                label="Description"
                                rows={6}
                            />
                        </Col>



                    </Row>
                </div>


                <Button htmlType="submit" type="primary" className='ml-5'>
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default TaskCreatePage;