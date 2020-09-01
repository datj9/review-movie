import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [isActiveNav, setIsActiveNav] = useState(false);

    return (
        <nav className='navbar' role='navigation' aria-label='main navigation'>
            <div className='navbar-brand'>
                <Link href='/'>
                    <a className='navbar-item logo-wrapper'>
                        <img src='/logo.png' />
                    </a>
                </Link>

                <span
                    role='button'
                    className={isActiveNav ? "navbar-burger burger is-active" : "navbar-burger burger"}
                    aria-label='menu'
                    aria-expanded='false'
                    data-target='navbarBasicExample'
                    onClick={() => setIsActiveNav(!isActiveNav)}
                >
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                </span>
            </div>

            <div id='navbarBasicExample' className={isActiveNav ? "navbar-menu is-active" : "navbar-menu"}>
                <div className='navbar-start'>
                    <a className='navbar-item'>Đánh Giá Phim</a>

                    <a className='navbar-item'>Đánh Giá Rạp</a>
                </div>

                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <div className='buttons'>
                            <Link href='login'>
                                <a className='button is-primary'>Đăng Nhập</a>
                            </Link>
                        </div>
                    </div>
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
