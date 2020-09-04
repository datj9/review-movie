import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    AccountCircle,
    AccountCircleOutlined,
    MovieFilter,
    MovieFilterOutlined,
    Theaters,
    TheatersOutlined,
    Notifications,
    NotificationsOutlined,
} from "@material-ui/icons";

function BottomNavigation(props) {
    const router = useRouter();

    const [tabActive, setTabActive] = useState(0);
    const tabsList = [
        {
            name: "Phim",
            filledIcon: <MovieFilter htmlColor='#f69314' />,
            outlinedIcon: <MovieFilterOutlined htmlColor='#676767' />,
            href: "/",
        },
        {
            name: "Rạp Chiếu",
            filledIcon: <Theaters htmlColor='#f69314' />,
            outlinedIcon: <TheatersOutlined htmlColor='#676767' />,
            href: "/",
        },
        {
            name: "Thông Báo",
            filledIcon: <Notifications htmlColor='#f69314' />,
            outlinedIcon: <NotificationsOutlined htmlColor='#676767' />,
            href: "/",
        },
        {
            name: "Tài Khoản",
            filledIcon: <AccountCircle htmlColor='#f69314' />,
            outlinedIcon: <AccountCircleOutlined htmlColor='#676767' />,
            href: "/login",
        },
    ];

    useEffect(() => {
        const { pathname } = router;
        switch (true) {
            case pathname === "/" || pathname.startsWith("/movies"):
                setTabActive(0);
                break;
            case pathname.startsWith("/theaters"):
                setTabActive(1);
                break;
            case pathname.startsWith("/login") ||
                pathname.startsWith("/register") ||
                pathname.startsWith("/my-account"):
                setTabActive(3);
                break;

            default:
                break;
        }
    }, [router.pathname]);

    return (
        <ul className='bottom-nav'>
            {tabsList.map((tab, i) => (
                <li key={i} className={`nav-item ${tabActive !== i ? "" : "tab-active"}`}>
                    <Link href={tab.href}>
                        <a>
                            {tabActive !== i ? tab.outlinedIcon : tab.filledIcon}
                            <span className='tab-name'>{tab.name}</span>
                        </a>
                    </Link>
                </li>
            ))}
            <style global jsx>
                {`
                    .bottom-nav {
                        display: flex;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        background: #fff;
                        border-top: 1px solid #bdbdbd;
                    }
                    .nav-item {
                        width: 25%;
                        height: 3.3rem;
                    }
                    .nav-item a {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .tab-name {
                        color: #676767;
                    }
                    .tab-active .tab-name {
                        color: #f69314;
                    }
                    .fa-film,
                    .fa-map-marked {
                        width: 1.2rem;
                    }
                `}
            </style>
        </ul>
    );
}

export default BottomNavigation;
