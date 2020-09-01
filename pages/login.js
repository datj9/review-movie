import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withUserServerSideProps, withUser } from "../HOC/withUser";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/user/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/dist/client/router";

function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const isLoading = useSelector((state) => state.user.isLoading);
    const errors = useSelector((state) => state.user.errors);
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const router = useRouter();

    const submitFormLogin = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        dispatch(login({ email: username, password }, "local"));
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated]);
    console.log(errors);
    useEffect(() => {
        if (errors.email && errors.email.includes("required")) {
            setEmailErrMsg("Vui lòng nhập email");
        }
        if (errors.email && errors.email.includes("invalid")) {
            setEmailErrMsg("Email không hợp lệ");
        }
        if (errors.email && errors.email.includes("not found")) {
            setEmailErrMsg("Email không tồn tại");
        }
    }, [errors.email]);

    return (
        <div className='login py-5 px-0 has-background-white'>
            <Head>
                <title>Đăng nhập để dánh giá phim</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className='title px-4'>Đăng Nhập vào Tài Khoản Của Bạn</div>
            <hr className='px-4' />

            <div className='form-container px-4'>
                <div className='buttons are-medium'>
                    <Link href='/api/auth/google'>
                        <a className='button is-fullwidth has-text-black has-background-white mb-3'>
                            <span className='google-icon-wp'>
                                <img alt='google-icon' src='/google-icon.svg' />
                            </span>
                            <span className='ml-3 d-inline-block'>Đăng Nhập với Google</span>
                        </a>
                    </Link>
                    <Link href='/api/auth/facebook'>
                        <a className='fb-btn button is-fullwidth has-text-white'>
                            <FontAwesomeIcon style={{ height: "1.25rem" }} icon={faFacebookF} />
                            <span className='ml-3 d-inline-block'>Đăng Nhập với Facebook</span>
                        </a>
                    </Link>
                </div>
                <div className='has-text-centered my-3 or-wrapper'>
                    <hr />
                    <span className='or'>Hoặc</span>
                </div>
                <form className='mb-3'>
                    <div className='field'>
                        <label className='label'>Email</label>
                        <div className='control has-icons-left has-icons-right'>
                            <input
                                ref={usernameRef}
                                className={`input is-medium ${emailErrMsg ? "is-danger" : ""}`}
                                type='email'
                                placeholder='Địa chỉ email'
                            />
                            <span className='icon is-small is-left'>
                                <FontAwesomeIcon style={{ height: "1rem" }} icon={faUser} />
                            </span>
                        </div>
                        {emailErrMsg ? <p className='has-text-danger'>{emailErrMsg}</p> : null}
                    </div>
                    <div className='field mb-3'>
                        <label className='label'>Mật khẩu</label>
                        <div className='control has-icons-left has-icons-right'>
                            <input
                                ref={passwordRef}
                                className='input is-medium'
                                type='password'
                                placeholder='Mật khẩu'
                            />
                            <span className='icon is-small is-left'>
                                <FontAwesomeIcon style={{ height: "1rem" }} icon={faLock} />
                            </span>
                        </div>
                    </div>
                    <button
                        disabled={isLoading}
                        className={`button is-primary is-fullwidth is-medium ${isLoading ? "is-loading" : ""}`}
                        type='submit'
                        onClick={submitFormLogin}
                    >
                        Đăng Nhập
                    </button>
                </form>

                <div className='register-and-forgot-pass-wp'>
                    <div className='register-wp'>
                        <span>Bạn chưa có tài khoản? </span>
                        <Link href='/register'>
                            <a>Đăng Ký</a>
                        </Link>
                    </div>
                    <div className='forgot-pass-wp'>
                        <Link href='/register'>
                            <a>Quên Mật Khẩu</a>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .login {
                        min-height: calc(100vh - 3.25rem);
                    }
                    .title,
                    .form-container,
                    hr {
                        width: 100%;
                    }
                    .title {
                        font-size: 1rem;
                    }
                    .or-wrapper {
                        position: relative;
                    }
                    .or {
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: #fff;
                        display: inline-block;
                        padding: 0.3rem;
                        z-index: 2;
                    }
                    .form-container {
                        margin: 0 auto;
                    }
                    hr {
                        margin: 1rem auto;
                    }

                    .icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .input {
                        border: 0.5px solid #000;
                    }
                    .input:focus,
                    .input:active {
                        border-color: #f69314;
                    }
                    .google-icon-wp {
                        width: 1.25rem;
                        height: 1.25rem;
                        display: flex;
                        align-items: center;
                    }
                    .google-icon-wp img {
                        width: 100%;
                    }
                    .fb-btn {
                        background: #3b5998;
                        display: flex;
                        justify-content: center;
                    }
                    .register-and-forgot-pass-wp {
                        display: flex;
                        flex-direction: column;
                    }
                    .register-wp {
                        width: 100%;
                    }
                    .forgot-pass-wp {
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                    }
                    @media only screen and (min-width: 576px) {
                        .title,
                        .form-container,
                        hr {
                            width: 30rem;
                        }
                        .title {
                            margin: 0 auto;
                            font-size: 1.4rem;
                        }
                        .register-and-forgot-pass-wp {
                            flex-direction: row;
                            justify-content: space-between;
                        }
                        .register-wp {
                            width: 65%;
                        }
                        .forgot-pass-wp {
                            width: 25%;
                            display: flex;
                            justify-content: flex-end;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = withUserServerSideProps();

export default withUser(Login);
