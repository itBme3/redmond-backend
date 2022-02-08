export interface AdminPage {
        title: string;
        path: string;
        color: string;
        icon: string;
        children?:AdminPage[]
}
export const ADMIN_PAGES:AdminPage[] = [
        
        {
                title: 'Projects',
                path: '/site/projects',
                color: 'red',
                icon: 'projects'
        },
        {
                title: 'Pages',
                path: '/site/pages',
                color: 'purple',
                icon: 'pages'
        },
        {
                title: 'Posts',
                path: '/site/posts',
                color: 'blue',
                icon: 'posts'
        },
        {
                title: 'Team',
                path: '/site/team',
                color: 'cyan',
                icon: 'team'
        },
        {
                title: 'Hiring',
                path: '/site/hiring',
                color: 'green',
                icon: 'hiring'
        },
        {
                title: 'Navigation',
                path: '/site/navigation',
                color: 'yellow',
                icon: 'navigation'
        },
        {
                title: 'Footer',
                path: '/site/footer',
                color: 'purple',
                icon: 'footer'
        },
        {
                title: 'Uploads',
                path: '/site/uploads',
                color: 'blue',
                icon: 'uploads'
        },
        // {
        //         title: 'Forms',
        //         path: '/site/forms',
        //         color: 'orange',
        //         icon: 'forms'
        // },
        {
                title: 'Access',
                path: '/users',
                color: 'orange',
                icon: 'users'
        }
];

export const ADMIN_COLORS = ADMIN_PAGES.reduce((acc, pge) => {
        return {
                ...acc,
                [pge.title.toLowerCase()]: pge.color
        }
}, {})