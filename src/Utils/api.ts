import { BACKEND_URL } from "./url";

type ILoginData = {
    username: string,
    password: string;
};

type IEditProject = {
    projectId?: string;
    title?: string;
};


export const loginFn = async (loginData: ILoginData) => {
    const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    const data = await response.json();
    return data;
};

export const editProjectFn = async ({ projectId, title }: IEditProject) => {
    const response = await fetch(`${BACKEND_URL}/projects/edit-project/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    const data = await response.json();
    return data;
};

export const deleteProjectFn = async (projectId: string) => {
    const response = await fetch(`${BACKEND_URL}/projects/delete-project/${projectId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    return data;
};
