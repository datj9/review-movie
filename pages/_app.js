import "../styles/globals.scss";
import "../sass/mystyles.scss";
import { wrapper } from "../redux/store";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

function MyApp({ Component, pageProps }) {
    const user = pageProps.user ? JSON.parse(pageProps.user) : {};

    return (
        <>
            <Header user={user} />
            <Component {...pageProps} />
            <BottomNavigation user={user} />
        </>
    );
}

export default wrapper.withRedux(MyApp);
