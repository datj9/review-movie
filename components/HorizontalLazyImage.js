import { useEffect, useRef } from "react";

function elementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export default function HorizontalLazyImage({ listIndex, src, alt }) {
    const imgRef = useRef();
    let loaded = false;

    const handleScroll = () => {
        if (!loaded && elementInViewport(imgRef.current)) {
            const imgLoader = new Image();

            imgLoader.src = src;
            imgLoader.onload = () => {
                imgRef.current.setAttribute(`src`, src);
                loaded = true;
            };
        }
    };

    useEffect(() => {
        document
            .getElementsByClassName("list-movies")
            [listIndex].addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            document
                .getElementsByClassName("list-movies")
                [listIndex].removeEventListener("scroll", handleScroll);
        };
    });
    return (
        <>
            <img
                ref={imgRef}
                src={"https://dummyimage.com/200x300/fff/fff.jpg"}
                alt={alt}
            />
            <style jsx>
                {`
                    img {
                        width: 100%;
                        height: auto;
                    }
                `}
            </style>
        </>
    );
}
