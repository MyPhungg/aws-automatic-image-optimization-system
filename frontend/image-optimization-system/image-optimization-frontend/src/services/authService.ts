import api from "../api/axios";

export interface GoogleLoginResponse {

    token: string;

    email: string;

    name: string;

    avatarUrl: string;

}

export const authService = {

    async googleLogin(idToken: string): Promise<GoogleLoginResponse> {

        const response = await api.post<GoogleLoginResponse>(
            "/auth/google",
            {
                idToken
            }
        );

        return response.data;

    }

};