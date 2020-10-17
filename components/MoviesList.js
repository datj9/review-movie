import Link from "next/link";
import VerticalLazyImage from "../components/VerticalLazyImage";

export default function MoviesList({ movies }) {
    return (
        <div className='movies-list'>
            {movies?.map((movie) => (
                <Link key={movie._id} href={`/movies/${movie._id}`}>
                    <a className='movie-card mb-4'>
                        <div className='movie-image-wrapper'>
                            <VerticalLazyImage
                                src={movie.image}
                                alt={movie.name}
                            />
                        </div>
                        <h3 className='movie-name py-2 pl-1'>{movie.name}</h3>
                    </a>
                </Link>
            ))}
            <style jsx>
                {`
                    .movies-list {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }
                    .movie-card {
                        width: 47%;
                        border: 1px solid #e8e8e8;
                    }
                    .movie-image-wrapper {
                        width: 100%;
                    }

                    .movie-name {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    @media only screen and (min-width: 576px) {
                        .movie-card {
                            width: 31%;
                        }
                    }
                    @media only screen and (min-width: 786px) {
                        .movie-card {
                            width: 23%;
                        }
                    }
                    @media only screen and (min-width: 1024px) {
                        .movie-card {
                            width: 16%;
                        }
                    }
                `}
            </style>
        </div>
    );
}
