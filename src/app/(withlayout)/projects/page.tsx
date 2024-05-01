"use client";
import TPTable from "@/components/UI/Table";
import { Button, Row, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "@/Utils/url";
import { deleteProjectFn, editProjectFn } from "@/Utils/api";
import { useRouter } from "next/navigation";
import TPModal from "@/components/UI/Modal";
import { useEffect, useState } from "react";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";



const DashboardPage = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [projectData, setProjectData] = useState<any>(null);

    useEffect(() => {
        if (open === false) {
            setProjectData(null)
        }
    }, [open,projectData]);

    const [titleDefaultValue, setTitleDefaultValue] = useState<string>("");

    const router = useRouter();

    const queryClient = useQueryClient();

    const { data: projectsData, isLoading } = useQuery(
        {
            queryKey: ['projects'],
            queryFn: async () => {
                const response = await fetch(`${BACKEND_URL}/projects`);
                const data = await response.json();
                return data;
            }
        });
    // console.log("see projects data🚀", projectsData?.data);

    const handleTitleClick = (record: any) => {
        router.push(`/projects/${record?._id}`);
    };

    const handleEditProject = (project: any) => {
        setTitleDefaultValue(project?.title);
        setProjectData(project);
        setOpen(true);
        console.log("see project data📽️", project);
    };

    const {
        mutate
    } = useMutation({
        mutationFn: deleteProjectFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            if (data.success === true) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },
    });
    const {
        mutate: editMutate
    } = useMutation({
        mutationFn: editProjectFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            if (data.success === true) {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        },
    });



    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            _id: '_id',
            render: (text: any, record: any) => (
                <a onClick={() => handleTitleClick(record)}>{text}</a>
            ),
        },

        {
            title: "Action",
            render: function (data: any) {
                return (
                    <>
                        <Button
                            style={{
                                margin: "0px 5px",
                            }}
                            onClick={() => handleEditProject(data)}
                            type="primary"
                        >
                            <EditOutlined />
                        </Button>
                        <Button
                            onClick={() => mutate(data?._id)}
                            type="primary"
                            danger
                        >
                            <DeleteOutlined />
                        </Button>
                    </>
                );
            },
        },
    ];

    type FormValues = {
        title: string;
    };

    const onSubmit: SubmitHandler<FormValues> = (data: any) => {
        editMutate({ projectId: projectData?._id, title: data.title });
        setOpen(false);
    };

    return (
        <div className="mx-5">
            <h1 className="text-xl font-bold py-4">All Projects</h1>
            <TPTable columns={columns} dataSource={projectsData?.data} />
            <TPModal
                title="Edit Project"
                isOpen={open}
                closeModal={() => setOpen(false)}
            >
                <Row
                    justify="center"
                    align="middle"
                >

                    <div>
                        <Form submitHandler={onSubmit}>
                            <div className="mb-2">
                                <FormInput defaultValue={projectData?.title} name="title" type="text" size="large" label="Title" />
                            </div>

                            <Button type="primary" htmlType="submit">
                                Edit
                            </Button>
                        </Form>
                    </div>
                    {/* </Col> */}
                </Row>
            </TPModal>
        </div>
    );
};

export default DashboardPage;