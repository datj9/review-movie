import React from "react";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import { SET_USER } from "../redux/user/action-types";

export const withUserServerSideProps = () => {
    return (context) => {
        const user = JSON.stringify(context.req.user ? context.req.user : {});

        return {
            props: { user },
        };
    };
};

export const withUser = (WrappedComponent) => {
    return (props) => {
        const user = JSON.parse(props.user);
        const dispatch = useDispatch();

        if (Object.keys(user).length > 0) {
            dispatch({
                type: SET_USER,
                payload: user,
            });
        }

        return <WrappedComponent {...props} />;
    };
};
