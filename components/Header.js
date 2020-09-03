import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/actions";

export default function Header() {
    const [navOpen, setNavOpen] = useState(false);
    const { currentUser, isAuthenticated } = useSelector((state) => state.user.server);
    const { isLoading: isLoggingOut } = useSelector((state) => state.user.client);
    const dispatch = useDispatch();
    const navRef = useRef();
    const hamburgerBtnRef = useRef();

    const closeNav = () => {
        setNavOpen(false);
    };
    const toggleNav = () => {
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
                    <div className='navbar-item has-dropdown is-hoverable'>
                        <input id='checkMovie' type='checkbox' />
                        <label htmlFor='checkMovie' className='navbar-link'>
                            Phim
                        </label>
                        <div className='navbar-dropdown'>
                            <Link href='/'>
                                <a onClick={closeNav} className='navbar-item'>
                                    Phim Đang Chiếu
                                </a>
                            </Link>
                            <Link href='/'>
                                <a onClick={closeNav} className='navbar-item'>
                                    Phim Sắp Chiếu
                                </a>
                            </Link>
                        </div>
                    </div>

                    {currentUser.userType === "admin" ? (
                        <div className='navbar-item has-dropdown is-hoverable'>
                            <Link href='/manage-movies'>
                                <a className='navbar-link'>Quản lý phim</a>
                            </Link>

                            <div className='navbar-dropdown'>
                                <a className='navbar-item'>About</a>
                                <a className='navbar-item'>Jobs</a>
                            </div>
                        </div>
                    ) : null}
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
                                    <a onClick={closeNav} className='button is-primary is-fullwidth'>
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
                    .navbar-burger:hover {
                        background: none;
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
                    .navbar-dropdown {
                        display: none;
                    }
                    input[type="checkbox"] {
                        display: none;
                    }
                    input[type="checkbox"]:checked ~ .navbar-dropdown {
                        display: block;
                    }
                    input[type="checkbox"]:checked ~ .navbar-link::after {
                        transform: rotate(135deg);
                    }
                    .navbar-link::after {
                        transition: transform 0.2s;
                    }
                    .navbar-start,
                    .navbar-end {
                        animation: slide 0.4s;
                    }
                    @keyframes slide {
                        0% {
                            transform: translateY(1rem);
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </nav>
    );
}