import fetch from "isomorphic-unfetch";

export default class BaseAPI {
    constructor(prefixOfEndpoint) {
        this.prefixOfEndpoint = prefixOfEndpoint;
    }

    async get(suffixOfEndpoint) {
        try {
            const res = await fetch(`/api/${this.prefixOfEndpoint}/${suffixOfEndpoint}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            return { data, ok: res.ok };
        } catch (error) {
            console.log(error);
        }
    }
    async post(suffixOfEndpoint, body, contentType = "application/json") {
        try {
            const res = await fetch(`/api/${this.prefixOfEndpoint}/${suffixOfEndpoint}`, {
                method: "POST",
                headers: { "Content-Type": contentType },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            return { data, ok: res.ok };
        } catch (error) {
            console.log(error);
        }
    }
}
