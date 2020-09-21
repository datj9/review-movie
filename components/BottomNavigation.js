import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    Person,
    PersonOutlined,
    MovieFilter,
    MovieFilterOutlined,
    LocationOn,
    LocationOnOutlined,
    RateReview,
    RateReviewOutlined,
} from "@material-ui/icons";

function BottomNavigation(props) {
    const router = useRouter();
    const isAuthenticatedFromServer = Object.keys(props.user).length;
    const { isAuthenticated: isAuthenticatedFromClient } = useSelector((state) => state.user.server);

    const [tabActive, setTabActive] = useState(0);

    const tabsList = [
        {
            name: "Phim",
            filledIcon: <MovieFilter htmlColor='#f69314' />,
            outlinedIcon: <MovieFilterOutlined htmlColor='#676767' />,
            href: "/",
        },
        {
            name: "Rạp chiếu",
            filledIcon: <LocationOn htmlColor='#f69314' />,
            outlinedIcon: <LocationOnOutlined htmlColor='#676767' />,
            href: "/",
        },
        {
            name: "Đánh giá",
            filledIcon: <RateReview htmlColor='#f69314' />,
            outlinedIcon: <RateReviewOutlined htmlColor='#676767' />,
            href: "/",
        },
        {
            name: "Tài khoản",
            filledIcon: <Person htmlColor='#f69314' />,
            outlinedIcon: <PersonOutlined htmlColor='#676767' />,
            href:
                isAuthenticatedFromServer || isAuthenticatedFromClient
                    ? "/my-account"
                    : router.pathname === "/register" || router.pathname === "/my-account"
                    ? router.pathname
                    : "/login",
        },
    ];

    useEffect(() => {
        const { pathname } = router;
        const regExpHomeTab = new RegExp("^/$|^/movies");
        const regExpTheatersTab = new RegExp("^/theaters");
        const regExpAccountTab = new RegExp("^/login|^/register|^/my-account|^/forgot-password");

        switch (true) {
            case regExpHomeTab.test(pathname):
                setTabActive(0);
                break;
            case regExpTheatersTab.test(pathname):
                setTabActive(1);
                break;
            case regExpAccountTab.test(pathname):
                setTabActive(3);
                break;
            default:
                break;
        }
    }, [router.pathname]);

    return (
        <ul className='bottom-nav'>
            {tabsList.map((tab, i) => (
                <li key={i} className={`nav-item px-2 ${tabActive !== i ? "" : "tab-active"}`}>
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
                        justify-content: space-around;
                        position: fixed;
                        z-index: 9;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        background: #fff;
                        border-top: 1px solid #e8e8e8;
                    }
                    .nav-item {
                        height: 3.8rem;
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
                    @media only screen and (min-width: 768px) {
                        .bottom-nav {
                            display: none;
                        }
                    }
                `}
            </style>
        </ul>
    );
}

export default BottomNavigation;
