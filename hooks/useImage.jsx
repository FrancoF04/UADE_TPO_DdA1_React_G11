const images = {
    G1: require('../assets/images/G1.png'),
    GO2: require('../assets/images/GO2.png'),
};

export const useImage = (name) => {
    return images[name?.toUpperCase()] || null;
};