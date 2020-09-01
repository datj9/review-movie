import "../styles/globals.scss";
import "../sass/mystyles.scss";
import { wrapper } from "../redux/store";

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
