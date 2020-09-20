import Head from "next/head";
import MoviesList from "../components/MoviesList";
import connectDB from "../setup/connectDB";

function NowShowingMovies(props) {
    const movies = JSON.parse(props.movies);

    return (
        <div className='px-3 pt-5 pb-6'>
            <Head>
                <title>Phim Đang Chiếu</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <h1 className='has-text-weight-bold mb-4'>Phim Đang Chiếu</h1>
            <MoviesList movies={movies} />
        </div>
    );
}

export async function getStaticProps() {
    try {
        const db = await connectDB();
        const movies = await db.collection("movies").find({ status: 1 }).toArray();

        return {
            props: { movies: JSON.stringify(movies) },
        };
    } catch (error) {
        return {
            props: { movies: JSON.stringify([]) },
        };
    }
}

export default NowShowingMovies;
