import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // on the server
        const serviceName = 'ingress-nginx-controller';
        const namespace = 'ingress-nginx';
        const url = `http://${serviceName}.${namespace}.svc.cluster.local`;


        return axios.create({
            baseURL: url,
            headers: req.headers
        });
    } else {
        // on the browser
        return axios.create({
            baseURL: '/',
        });
    }
};