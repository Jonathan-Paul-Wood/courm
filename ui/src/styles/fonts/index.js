import Lato from './Lato-Regular.woff';

export const bodyFont = {
    fontFamily: 'Lato',
    src: `
        local('Lato'),
        url(${Lato})
        format('woff')`,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textRendering: 'optimizeLegibility'
};

export const defaultFont = {
    fontFamily: 'default',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textRendering: 'optimizeLegibility'
};
