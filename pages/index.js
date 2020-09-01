import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { withUserServerSideProps, withUser } from "../HOC/withUser";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";

function Home() {
    const currentUser = useSelector((state) => state.user.currentUser);

    return (
        <div>
            <Head>
                <title>Đánh giá phim mới</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            {/* <Header /> */}
            <main>
                {/* <a href='/api/auth/logout'>Log Out</a>
                <div>{currentUser.name}</div>
                <div>{currentUser.username}</div>
                <div style={{ height: "50px", width: "50px", overflow: "hidden" }}>
                    <img style={{ width: "100%" }} src={currentUser.image} />
                </div>
                <form>
                    <input ref={usernameRef} />
                    <input ref={passwordRef} />
                    <button type='submit' onClick={submit}>
                        Dang ky
                    </button>
                </form> */}
            </main>

            {/* <footer className='has-background-info'>
                    <a
                        href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Powered by <img src='/vercel.svg' alt='Vercel Logo' />
                    </a>
                </footer> */}
        </div>
    );
}

export const getServerSideProps = withUserServerSideProps();

export default withUser(Home);
