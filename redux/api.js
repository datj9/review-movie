export const apiURL = process.env.API_URL;

export default class BaseAPI {
    constructor(prefixOfEndpoint) {
        this.prefixOfEndpoint = prefixOfEndpoint;
    }

    async get(suffixOfEndpoint) {
        try {
            const url = `/api/${this.prefixOfEndpoint}/${suffixOfEndpoint}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                const data = await res.json();

                return {
                    data,
                    ok: res.ok,
                };
            } else {
                throw res;
            }
        } catch (error) {
            return {
                data: {},
                ok: false,
            };
        }
    }
    async post(suffixOfEndpoint, body, contentType = "application/json") {
        try {
            const url = `/api/${this.prefixOfEndpoint}/${suffixOfEndpoint}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": contentType,
                },
                body: JSON.stringify(body),
            });

            if (res.status === 200 || res.status === 201 || res.status === 400 || res.status === 404) {
                const data = await res.json();

                return {
                    data,
                    ok: res.ok,
                };
            } else {
                throw res;
            }
        } catch (error) {
            return {
                data: {},
                ok: false,
            };
        }
    }
}
