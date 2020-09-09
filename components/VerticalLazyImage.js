import { useEffect, useRef } from "react";

function elementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return rect.top + 30 <= (window.innerHeight || document.documentElement.clientHeight);
}

export default function VerticalLazyImage({ src, alt }) {
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
        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
    return <img ref={imgRef} src={"https://dummyimage.com/200x300/fff/fff.jpg"} alt={alt} />;
}