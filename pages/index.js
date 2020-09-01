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

            <main></main>

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
