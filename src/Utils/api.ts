import { BACKEND_URL } from "./url";

type ILoginData = {
    username: string,
    password: string;
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
