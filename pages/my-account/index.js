import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/user/actions";
import { withUserServerSideProps, withUser } from "../../HOC/withUser";

function MyAccount() {
    const router = useRouter();
    const { isLoading: isLoggingOut } = useSelector((state) => state.user.client);
    const { isAuthenticated } = useSelector((state) => state.user.server);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        router.replace("/login");
    };

    if (!isAuthenticated) {
        router.replace("/login");
    }

    return (
        <div>
            My Account
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

export const getServerSideProps = withUserServerSideProps();

export default withUser(MyAccount);
