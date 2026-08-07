export interface MenuItem {

    title: string;

    path: string;

}

export const guestMenu: MenuItem[] = [

    {

        title: "Upload",

        path: "/upload"

    },

    {

        title: "Login",

        path: "/login"

    }

];

export const userMenu: MenuItem[] = [

    {

        title: "Dashboard",

        path: "/dashboard"

    },

    {

        title: "Upload",

        path: "/upload"

    },

    {
        title: "History",
        path: "/history"
    }
];

export const adminMenu: MenuItem[] = [
    {
        title: "Dashboard",
        path: "/dashboard"
    },
    {
        title: "Upload",
        path: "/upload"
    },
    {
        title: "History",
        path: "/history"
    },
    {
        title: "Admin",
        path: "/admin"
    }
];

export function getMenuItems(isAuthenticated: boolean, role?: string): MenuItem[] {
    if (!isAuthenticated) {
        return guestMenu;
    }
    if (role?.toUpperCase() === "ADMIN") {
        return adminMenu;
    }
    return userMenu;
}