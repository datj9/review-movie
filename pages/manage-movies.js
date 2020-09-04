import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { withAuthServerSideProps, withAuth } from "../HOC/withAuth";

function ManageMovies() {
    return (
        <table className='table'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>
                        <abbr title='Tên'>Tên phim</abbr>
                    </th>

                    <th>Diễn viên</th>
                    <th>Đạo diễn</th>
                    <th>Ngày ra mắt</th>
                    <th>Thời lượng</th>
                    <th>Hình ảnh</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <nav className='pagination' role='navigation' aria-label='pagination'>
                        <a className='pagination-previous' title='This is the first page' disabled>
                            Previous
                        </a>
                        <a className='pagination-next'>Next page</a>
                        <ul className='pagination-list'>
                            <li>
                                <a className='pagination-link is-current' aria-label='Page 1' aria-current='page'>
                                    1
                                </a>
                            </li>
                            <li>
                                <a className='pagination-link' aria-label='Goto page 2'>
                                    2
                                </a>
                            </li>
                            <li>
                                <a className='pagination-link' aria-label='Goto page 3'>
                                    3
                                </a>
                            </li>
                        </ul>
                    </nav>
                </tr>
            </tfoot>
            <tbody></tbody>
        </table>
    );
}

export const getServerSideProps = withAuthServerSideProps();

export default withAuth(ManageMovies);
