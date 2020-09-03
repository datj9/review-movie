import React from "react";
import { SET_USER } from "../redux/user/action-types";
import { wrapper } from "../redux/store";

export const withUserServerSideProps = () => {
    return wrapper.getServerSideProps(({ store, req }) => {
        const user = req.user ? req.user : {};
        console.log("setted user");
        store.dispatch({
            type: SET_USER,
            payload: user,
        });

        return {
            props: { user: JSON.stringify(user) },
        };
    });
};

export const withUser = (WrappedComponent) => {
    return (props) => {
        return <WrappedComponent {...props} />;
    };
};
