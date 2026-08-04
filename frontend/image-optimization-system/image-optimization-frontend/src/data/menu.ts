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

    },

    {

        title: "Settings",

        path: "/settings"

    }

];