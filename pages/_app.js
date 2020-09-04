import "../styles/globals.scss";
import "../sass/mystyles.scss";
import { wrapper } from "../redux/store";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
            <BottomNavigation />
        </>
    );
}

export default wrapper.withRedux(MyApp);
