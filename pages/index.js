import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useRef } from "react";
import fetch from "isomorphic-unfetch";

export default function Home(props) {
    const user = JSON.parse(props.user);
    const usernameRef = useRef();
    const passwordRef = useRef();
    console.log(user);
    const submit = (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        }).then((res) => console.log(res));
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Link href="/api/auth/google">
                    <a>Log In Google</a>
                </Link>
                <Link href="/api/auth/facebook">
                    <a>Log In FB</a>
                </Link>

                <a href="/api/auth/logout">Log Out</a>
                <div>{user.name}</div>
                <div>{user.username}</div>
                <div style={{ height: "50px", width: "50px", overflow: "hidden" }}>
                    <img style={{ width: "100%" }} src={user.image} />
                </div>
                <form>
                    <input ref={usernameRef} />
                    <input ref={passwordRef} />
                    <button type="submit" onClick={submit}>
                        Dang ky
                    </button>
                </form>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <p className={styles.description}>
                    Get started by editing <code className={styles.code}>pages/index.js</code>
                </p>

                <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h3>Documentation &rarr;</h3>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h3>Learn &rarr;</h3>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
                        <h3>Examples &rarr;</h3>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h3>Deploy &rarr;</h3>
                        <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>
    );
}

export function getServerSideProps(context) {
    const user = JSON.stringify(context.req.user ? context.req.user : {});

    return {
        props: { user },
    };
}
