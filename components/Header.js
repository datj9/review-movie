import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/actions";

export default function Header() {
    const [navOpen, setNavOpen] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const isLoggingOut = useSelector((state) => state.user.isLoading);
    const dispatch = useDispatch();
    const navRef = useRef();
    const hamburgerBtnRef = useRef();

    const closeNav = () => {
        setNavOpen(false);
    };
    const toggleNav = () => {
        console.log(navOpen);
        setNavOpen((navOpen) => !navOpen);
    };
    const handleClick = (e) => {
        if (!navRef.current?.contains(e.target) && !hamburgerBtnRef.current?.contains(e.target)) {
            closeNav();
        }
    };
    const handleLogout = () => {
        dispatch(logout());
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
    }, []);

    return (
        <nav className='navbar' role='navigation' aria-label='main navigation'>
            <div className='navbar-brand'>
                <Link href='/'>
                    <a onClick={closeNav} className='navbar-item logo-wrapper'>
                        <img src='/logo.png' />
                    </a>
                </Link>
                {/* <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                    <defs>
                        <linearGradient id="half_grad">
                            <stop offset="100%" stop-color="yellow" />
                            <stop offset="100%" stop-color="white" stop-opacity="1" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,
             31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,
             12.118l11.547-1.2L16.026,0.6L20.388,10.918z"
                        fill="url(#half_grad)"
                        stroke-width="1"
                        stroke="yellow"
                    />
                </svg> */}
                <span
                    ref={hamburgerBtnRef}
                    role='button'
                    className={navOpen ? "navbar-burger burger is-active" : "navbar-burger burger"}
                    aria-label='menu'
                    aria-expanded='false'
                    data-target='navbarBasicExample'
                    onClick={toggleNav}
                >
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                </span>
            </div>

            <div ref={navRef} id='navbarBasicExample' className={navOpen ? "navbar-menu is-active" : "navbar-menu"}>
                <div className='navbar-start'>
                    <a onClick={closeNav} className='navbar-item'>
                        Đánh Giá Phim
                    </a>

                    <a onClick={closeNav} className='navbar-item'>
                        Đánh Giá Rạp
                    </a>
                </div>

                <div className='navbar-end'>
                    {isAuthenticated ? (
                        <div className='navbar-item'>
                            <button
                                onClick={handleLogout}
                                type='button'
                                className={`button is-primary is-outlined ${isLoggingOut ? "is-loading" : ""}`}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className='navbar-item'>
                            <div className='buttons'>
                                <Link href='/login'>
                                    <a onClick={closeNav} className='button is-primary'>
                                        Đăng nhập
                                    </a>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>
                {`
                    nav {
                        box-shadow: 1px 1px 1px #d4d4d4;
                    }
                    .logo-wrapper {
                        display: flex;
                        align-items: center;
                        padding-top: 0;
                        padding-bottom: 0;
                    }
                    .logo-wrapper img {
                        width: 2.75rem;
                        height: 2.75rem;
                        max-height: unset;
                        border-radius: 5px;
                    }
                `}
            </style>
        </nav>
    );
}
