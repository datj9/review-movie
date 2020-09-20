import fetch from "isomorphic-unfetch";
import MoviesList from "../components/MoviesList";
import { apiURL } from "../redux/api";

function NowShowingMovies({ movies }) {
    return (
        <div className='px-3 pt-5 pb-6'>
            <h1 className='has-text-weight-bold mb-4'>Phim Đang Chiếu</h1>
            <MoviesList movies={movies} />
        </div>
    );
}

export async function getStaticProps() {
    try {
        const res = await fetch(`${apiURL}/api/movies?status=[1]&&pageSize=100`);
        const data = await res.json();
        const movies = data.movies[0];

        return {
            props: { movies },
        };
    } catch (error) {
        return {
            props: { movies: [] },
        };
    }
}

export default NowShowingMovies;
