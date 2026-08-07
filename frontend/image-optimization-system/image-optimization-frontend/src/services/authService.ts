import api from "../api/axios";

export interface GoogleLoginResponse {

    token?: string;
    userId?: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role?: string;

}

export const authService = {

    async googleLogin(idToken: string): Promise<GoogleLoginResponse> {

        const response = await api.post<GoogleLoginResponse>(
            "/auth/google",
            {
                idToken
            }
        );

        return {
            ...response.data,
            token: response.data.token ?? response.data.userId ?? "",
        };

    },

    async logout(): Promise<void> {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout API failed:", error);
        }
    }

};