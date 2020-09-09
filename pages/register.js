import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withAuthServerSideProps, withAuth } from "../HOC/withAuth";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/user/actions";
import { useRouter } from "next/dist/client/router";
import { CLEAN_UP } from "../redux/user/action-types";
import { BulletList } from "react-content-loader";

function Register(props) {
    const emailRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const { isLoading, errors, isSuccess } = useSelector((state) => state.user.client);
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const [passwordErrMsg, setPasswordErrMsg] = useState("");
    const [nameErrMsg, setNameErrMsg] = useState("");
    const router = useRouter();
    const isAuthenticated = Object.keys(props.user).length;

    const submitFormRegister = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const name = nameRef.current.value;
        dispatch(register({ email, password, name }));
        setEmailErrMsg("");
        setPasswordErrMsg("");
    };

    useEffect(() => {
        if (isSuccess) {
            router.replace("/");
        }

        return () => {
            dispatch({ type: CLEAN_UP });
        };
    }, [isSuccess]);

    useEffect(() => {
        if (errors.email && errors.email.includes("required")) {
            setEmailErrMsg("Vui lòng nhập email");
        } else if (errors.email && errors.email.includes("invalid")) {
            setEmailErrMsg("Email không hợp lệ");
        } else if (errors.email && errors.email.includes("exists")) {
            setEmailErrMsg("Email này đã tồn tại");
        } else {
            setEmailErrMsg("");
        }
    }, [errors.email]);

    useEffect(() => {
        if (errors.name && errors.name.includes("required")) {
            setNameErrMsg("Vui lòng nhập họ tên");
        } else {
            setNameErrMsg("");
        }
    }, [errors.name]);

    useEffect(() => {
        if (errors.password && errors.password.includes("required")) {
            setPasswordErrMsg("Vui lòng nhập mật khẩu");
        } else if (errors.password && errors.password.includes("weak")) {
            setPasswordErrMsg("Mật khẩu phải có ít nhất 8 ký tự");
        } else {
            setPasswordErrMsg("");
        }
    }, [errors.password]);

    if (isAuthenticated) {
        const windowWidth = typeof document !== "undefined" ? document.documentElement.clientWidth : 0;

        if (windowWidth >= 992) {
            return null;
        } else {
            return (
                <div className='px-3'>
                    <BulletList />
                </div>
            );
        }
    }

    return (
        <div className='register py-6 mb-5 has-background-white'>
            <Head>
                <title>Đánh Giá Phim - Đăng ký tài khoản mới</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className='title px-4'>Đăng Ký Tài Khoản Mới</div>
            <hr className='px-4' />

            <div className='form-container px-4'>
                <form className='mb-3'>
                    <div className='field'>
                        <label className='label'>Email</label>
                        <div className='control'>
                            <input
                                ref={emailRef}
                                className='input is-medium'
                                type='email'
                                placeholder='Địa chỉ email'
                            />
                        </div>
                        {emailErrMsg ? <p className='has-text-danger mt-1'>{emailErrMsg}</p> : null}
                    </div>
                    <div className='field'>
                        <label className='label'>Họ tên</label>
                        <div className='control'>
                            <input ref={nameRef} className='input is-medium' type='text' placeholder='Họ tên' />
                        </div>
                        {nameErrMsg ? <p className='has-text-danger mt-1'>{nameErrMsg}</p> : null}
                    </div>
                    <div className='field mb-3'>
                        <label className='label'>Mật khẩu</label>
                        <div className='control'>
                            <input
                                ref={passwordRef}
                                className='input is-medium'
                                type='password'
                                placeholder='Mật khẩu'
                            />
                        </div>
                        {passwordErrMsg ? <p className='has-text-danger mt-1'>{passwordErrMsg}</p> : null}
                    </div>
                    <button
                        disabled={isLoading}
                        className={`button is-primary is-fullwidth is-medium ${isLoading ? "is-loading" : ""}`}
                        type='submit'
                        onClick={submitFormRegister}
                    >
                        Đăng Nhập
                    </button>
                </form>

                <div className='register-wp'>
                    <span>Bạn đã có tài khoản? </span>
                    <Link href='/login'>
                        <a>Đăng Nhập</a>
                    </Link>
                </div>
            </div>

            <style jsx>
                {`
                    .register {
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
                    .form-container {
                        margin: 0 auto;
                    }
                    hr {
                        margin: 1rem auto;
                    }
                    .register-wp {
                        width: 100%;
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
                    }
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = withAuthServerSideProps();

export default withAuth(Register);
