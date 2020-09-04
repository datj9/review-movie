import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/user/actions";
import { withAuthServerSideProps, withAuth } from "../../HOC/withAuth";
import { CLEAN_UP } from "../../redux/user/action-types";

function MyAccount(props) {
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

    const isAuthenticated = Object.keys(props.user).length > 0;

    if (!isAuthenticated) {
        return <div>Loading.........</div>;
    }

    return (
        <div>
            <Head>
                <title>Tài Khoản của bạn</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <button
                onClick={handleLogout}
                type='button'
                className={`button is-primary is-outlined ${isLoggingOut ? "is-loading" : ""}`}
            >
                Đăng xuất
            </button>
        </div>
    );
}

export const getServerSideProps = withAuthServerSideProps();

export default withAuth(MyAccount);
