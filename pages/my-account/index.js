import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/user/actions";
import { withAuthServerSideProps, withAuth } from "../../HOC/withAuth";
import { CLEAN_UP } from "../../redux/user/action-types";
import Person from "@material-ui/icons/Person";
import ExitToApp from "@material-ui/icons/ExitToApp";

function MyAccount({ user }) {
    const router = useRouter();
    const { isLoading: isLoggingOut, isSuccess } = useSelector((state) => state.user.client);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
    };

    useEffect(() => {
        if (isSuccess) {
            router.replace("/login");
        }

        return () => {
            dispatch({ type: CLEAN_UP });
        };
    }, [isSuccess]);

    const isAuthenticated = Object.keys(user).length > 0;

    if (!isAuthenticated) return <div></div>;

    return (
        <div>
            <Head>
                <title>Tài Khoản của Tôi</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <ul className='px-3 py-3 mb-6'>
                <li className='mb-3'>
                    <div className='is-flex'>
                        <span className='is-block mr-3 avatar-wp'>
                            <img src={user.image} />
                        </span>
                        <span className='user-name'>{user.name}</span>
                    </div>
                </li>
                <li className='mb-3'>
                    <Link href='/my-account'>
                        <a className='is-flex has-text-grey-dark'>
                            <span className='mr-3'>
                                <Person />
                            </span>
                            <span>Thông tin tài khoản</span>
                        </a>
                    </Link>
                </li>
                <li className='mb-3'>
                    <div onClick={handleLogout}>
                        <a className='is-flex has-text-grey-dark'>
                            <span className='mr-3'>
                                <ExitToApp />
                            </span>
                            <span>Đăng xuất</span>
                        </a>
                    </div>
                </li>
            </ul>
            <style jsx>
                {`
                    .avatar-wp {
                        width: 2.5rem;
                        height: 2.5rem;
                    }
                    .avatar-wp img {
                        border-radius: 50%;
                    }
                    .user-name {
                        align-self: center;
                    }
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = withAuthServerSideProps();

export default withAuth(MyAccount);
