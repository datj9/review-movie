import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withAuthServerSideProps, withAuth } from "../HOC/withAuth";
import { CLEAN_UP } from "../redux/user/action-types";
import { confirmToken, reqSendEmail, changePasswordByVerifyingEmail } from "../redux/user/actions";
import { BulletList } from "react-content-loader";

function ForgotPassword(props) {
    const isAuthenticated = Object.keys(props.user).length;
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [verifyToken, setVerifyToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const [tokenErrMsg, setTokenErrMsg] = useState("");
    const [passwordErrMsg, setPasswordErrMsg] = useState("");
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState("");
    const [step, setStep] = useState(0);
    const [resentEmail, setResentEmail] = useState(false);
    const { isLoading, errors, isSuccess } = useSelector((state) => state.user.client);

    const dispatch = useDispatch();

    const submitSendEmail = (e) => {
        e.preventDefault();

        if (email) {
            dispatch(reqSendEmail(email));
            setEmailErrMsg("");
        } else {
            setEmailErrMsg("Vui lòng nhập email");
        }
    };
    const submitResendEmail = () => {
        dispatch(reqSendEmail(email));
        setResentEmail(true);
    };
    const submitVerifyToken = (e) => {
        e.preventDefault();

        if (verifyToken) {
            dispatch(confirmToken(verifyToken, email));
        }
    };
    const submitChangePassword = (e) => {
        e.preventDefault();

        if (password.length >= 8 && password === confirmPassword) {
            dispatch(changePasswordByVerifyingEmail({ email, password, confirmPassword, token: verifyToken }));
            setPasswordErrMsg("");
            setConfirmPasswordErrMsg("");
        } else {
            if (!password) {
                setPasswordErrMsg("Vui lòng nhập mật khẩu");
            } else if (password.length < 8) {
                setPasswordErrMsg("Mật khẩu phải có ít nhất 8 ký tự");
            } else {
                setPasswordErrMsg("");
            }

            if (!confirmPassword) {
                setConfirmPasswordErrMsg("Vui lòng nhập xác nhận mật khẩu");
            } else if (password !== confirmPassword) {
                setConfirmPasswordErrMsg("Xác nhận mật khẩu chưa trùng khớp");
            } else {
                setConfirmPasswordErrMsg("");
            }
        }
    };

    useEffect(() => {
        if (errors.email && errors.email.includes("invalid")) {
            setEmailErrMsg("Email không hợp lệ");
        } else {
            setEmailErrMsg("");
        }
    }, [errors.email]);

    useEffect(() => {
        if (errors.isValid === false) {
            setTokenErrMsg("Mã xác thực đã hết hạn");
        } else {
            setTokenErrMsg("");
        }
    }, [errors.isValid]);

    useEffect(() => {
        if (isSuccess && resentEmail) {
            setResentEmail(false);
        } else if (isSuccess && step < 2) {
            setStep(step + 1);
        } else if (isSuccess) {
            router.replace("/");
        }

        return () => {
            dispatch({
                type: CLEAN_UP,
            });
        };
    }, [isSuccess]);

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
        <div className='forgot-password py-6 mb-5 has-background-white'>
            <Head>
                <title>Quên Mật Khẩu</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            {step === 0 ? (
                <div className='form-container px-4'>
                    <form className='mb-3'>
                        <div className='field'>
                            <label className='label'>Địa chỉ email</label>
                            <div className='control'>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='input is-medium'
                                    type='email'
                                    placeholder='Địa chỉ email bạn muốn khôi phục'
                                />
                            </div>
                            {emailErrMsg ? <p className='has-text-danger mt-1'>{emailErrMsg}</p> : null}
                        </div>

                        <button
                            disabled={isLoading}
                            className={`button is-primary is-fullwidth is-medium ${isLoading ? "is-loading" : ""}`}
                            type='submit'
                            onClick={submitSendEmail}
                        >
                            Gửi email xác nhận
                        </button>
                    </form>
                </div>
            ) : null}

            {step === 1 ? (
                <div className='form-container px-4'>
                    <form className='mb-3'>
                        <div className='field'>
                            <p>Chúng tôi đã gữi mã xác thực đến email của bạn, bạn vui lòng kiểm tra</p>
                            <label className='label'>Mã xác thực</label>
                            <div className='control'>
                                <input
                                    value={verifyToken}
                                    onChange={(e) => setVerifyToken(e.target.value)}
                                    className='input is-medium'
                                    type='text'
                                    placeholder='Mã xác thực'
                                />
                            </div>
                            {tokenErrMsg ? <p className='has-text-danger mt-1'>{tokenErrMsg}</p> : null}
                        </div>
                        <a className='my-4' onClick={submitResendEmail}>
                            Gửi lại mã xác thực
                        </a>
                        <button
                            disabled={isLoading}
                            className={`button is-primary is-fullwidth is-medium ${isLoading ? "is-loading" : ""}`}
                            type='submit'
                            onClick={submitVerifyToken}
                        >
                            Xác nhận
                        </button>
                    </form>
                </div>
            ) : null}

            {step === 2 ? (
                <div className='form-container px-4'>
                    <form className='mb-3'>
                        <div className='field'>
                            <label className='label'>Mật khẩu mới</label>
                            <div className='control'>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='input is-medium'
                                    type='password'
                                    placeholder='Mật khẩu mới'
                                />
                            </div>
                            {passwordErrMsg ? <p className='has-text-danger mt-1'>{passwordErrMsg}</p> : null}
                        </div>
                        <div className='field'>
                            <label className='label'>Xác nhận mật khẩu mới</label>
                            <div className='control'>
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='input is-medium'
                                    type='password'
                                    placeholder='Xác nhận mật khẩu mới'
                                />
                            </div>
                            {confirmPasswordErrMsg ? (
                                <p className='has-text-danger mt-1'>{confirmPasswordErrMsg}</p>
                            ) : null}
                        </div>
                        <button
                            disabled={isLoading}
                            className={`button is-primary is-fullwidth is-medium ${isLoading ? "is-loading" : ""}`}
                            type='submit'
                            onClick={submitChangePassword}
                        >
                            Thay đổi
                        </button>
                    </form>
                </div>
            ) : null}
            <style jsx>
                {`
                    .forgot-password {
                        min-height: calc(100vh - 3.25rem);
                    }
                    .form-container {
                        width: 100%;
                    }
                    .form-container {
                        margin: 0 auto;
                    }

                    @media only screen and (min-width: 576px) {
                        .form-container {
                            width: 30rem;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = withAuthServerSideProps();

export default withAuth(ForgotPassword);
