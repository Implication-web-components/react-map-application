import React from 'react';
import ReactDOM from 'react-dom';

// Define a function to load components asynchronously
const loadReactify = async () => {
    const [mappableReact] = await Promise.all([
        mappable.import('@mappable-world/mappable-reactify'),
        mappable.ready,
    ]);
    return mappableReact.reactify.bindTo(React, ReactDOM);
};

let reactify: any;
let MMap: React.ComponentType<any>,
    MMapDefaultSchemeLayer: React.ComponentType<any>,
    MMapDefaultFeaturesLayer: React.ComponentType<any>,
    MMapMarker: React.ComponentType<any>;

// Function to prepare components after loading
export const initializeMappable = async () => {
    reactify = await loadReactify();
    ({ MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapMarker } = reactify.module(mappable));
};

// Export units
export { MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapMarker };
