import { axiosInstance } from '../configs/axiosSingleton';

export default class ExampleService {
    static getExample() {
        return axiosInstance.get('/app/api/example');
    }
}