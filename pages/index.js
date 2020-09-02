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

            <main>
                <div className='list-and-title-wp'>
                    <div className='title-container'>
                        <span>Phim Dang Chieu</span>
                    </div>
                    <div className='list-movies'>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>    <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                        <div className='movie-card mr-3'>
                            <img src='https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg' />
                            <div>
                                <span>Kẻ Cắp Nhân Dạng</span>
                            </div>
                        </div>
                    </div>
                </div>
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
            <style jsx>
                {`
                    .list-movies {
                        overflow: auto;
                        white-space: nowrap;
                    }
                    .movie-card {
                        display: inline-block;
                        width: 20rem;
                    }
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = withUserServerSideProps();

export default withUser(Home);
