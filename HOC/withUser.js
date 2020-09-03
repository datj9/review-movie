import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/actions";

export const withUserServerSideProps = () => {
    return ({ req }) => {
        const user = req.user ? req.user : {};

        return {
            props: { user: JSON.stringify(user) },
        };
    };
};

export const withUser = (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();
        const user = JSON.parse(props.user);

        if (Object.keys(user).length) {
            dispatch(setUser(user));
        }

        return <WrappedComponent {...props} />;
    };
};
