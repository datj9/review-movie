import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/actions";
import { useRouter } from "next/router";

export const withAuthServerSideProps = () => {
    return ({ req }) => {
        const user = req.user ? req.user : {};

        return {
            props: { user: JSON.stringify(user) },
        };
    };
};

export const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const dispatch = useDispatch();
        const user = JSON.parse(props.user);
        const isAuthenticated = Object.keys(user).length > 0;

        useEffect(() => {
            const regTestUnprotectedRoutes = RegExp("/login|/register|/forgot-password");
            if (isAuthenticated) {
                dispatch(setUser(user));
            }
            if (isAuthenticated && regTestUnprotectedRoutes.test(router.pathname)) {
                router.replace("/my-account");
            }
            // user try to access protected routes
            if (
                !isAuthenticated &&
                router.pathname !== "/login" &&
                router.pathname !== "/register" &&
                router.pathname !== "/forgot-password"
            ) {
                router.replace("/login");
            }
        }, []);

        return <WrappedComponent {...props} user={user} />;
    };
};
