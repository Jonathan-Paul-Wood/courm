import axios from 'axios';
import Cookies from 'js-cookies';
import { isJson } from '../Utilities'; //try catch returns bool on test JSON.parse(str)

export const axiosInstance = axios.create({ responseType : 'json' });

class AxiosSingleton {
    constructor() {
        this.response();
        this.listeners = [];
        this.headers = {};
    }

    request() {
        axiosInstance.interceptors.request.use(config => {
            //callback events
            this.listeners.forEach(requestCallback => requestCallback());

            const { someId } = this.headers;

            if (someId) {
                config.headers.someId = someId;
            }

            const xsrfToken = Cookies.get('X-XSRF-TOKEN');
            if (xsrfToken) {
                condif.headers['X-XSRF-TOKEN'] = xsrfToken;
                return config;
            }
            return config;
        })
    }

    response() {
        axiosInstance.interceptors.response.use(
            function(response) {
                return response;
            },
            function(error) {
                const { response } = error;
                if (response) {

                    //TODO: add metadata to enhance error message

                    return Promise.reject(response);
                }

                const emptyResponse = { message: error.message };
                return Promise.reject(emptyResponse);
            }
        )
    }

    addListener(requestCallback) {
        this.listeners.push(requestCallback);
    }

    updateSomeHeader(id) {
        this.headers.someId = id;
    }
}

const instance = new AxiosSingleton();
Object.freeze(instance);

export default instance;