import { BACKEND_URL } from "./url";

type ILoginData = {
    username: string,
    password: string;
};

type IEditProject = {
    projectId?: string;
    title?: string;
};

type ITask = {
    title?: string;
    assigned_to?: string[];
    description?: string;
    due_date?: string;
    isComplete?: boolean;
    status?: string;
    project?: string;
};

type IEditTask = {
    taskId: string;
    updateTaskData: ITask;
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
export const getUsersFn = async () => {
    const response = await fetch(`${BACKEND_URL}/users`, {
        method: "GET",
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

export const editTaskFn = async ({ taskId, updateTaskData }: IEditTask) => {
    const response = await fetch(`${BACKEND_URL}/tasks/edit-task/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateTaskData),
    });

    const data = await response.json();
    return data;
};

export const deleteTaskFn = async (taskId: string) => {
    const response = await fetch(`${BACKEND_URL}/tasks/delete-task/${taskId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    return data;
};

export const markAsCompleteTaskFn = async (taskId: string) => {
    const response = await fetch(`${BACKEND_URL}/tasks/mark-as-complete/${taskId}`, {
        method: "PUT"
    });
    const data = await response.json();
    return data;
};

export const createTaskFn = async (taskData: ITask) => {
    const response = await fetch(`${BACKEND_URL}/tasks/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });

    const data = await response.json();
    return data;
};
