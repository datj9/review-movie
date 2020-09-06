import fetch from "isomorphic-unfetch";
import { apiURL } from "../redux/api";

export default function NowShowingMovies() {
    return <div>Movies</div>;
}

export async function getStaticProps() {
    // const res = await fetch(`${apiURL}/movies?status=[0]`);
    // const data = await res.json();

    return {
        props: {},
    };
}
