# SOLAP Visualization Tool

## Overview of Technologies

UI Library: [React](https://reactjs.org/)
Component Library: [Grommet](https://v2.grommet.io/)
Map Library: [OpenLayers](https://openlayers.org/)

## Code Structure

This project uses the component-based architecture that is support by React.

### Styling

A CSS-in-JS approach is implemented for styling components. [Styled Components](https://www.styled-components.com/) is the specific library used for the implementation. Using componenets from Grommet gives you some default styling however it is a common usecase to override some of the Grommet component styling. Styled components let us do this.

### Map Design

The components to render the map were built to be as extensible as possible. The outermost parent component for the map is called `MapView.js`. `MapView` renders the `MapFilter`, the interactive filters to the left of the map, and the `MapContoller`, the controller for the open layers map.
The `MapController` takes in a few different data points as props:

- An OpenLayers view
- OpenLayers Layers array
- Width

The interface looks like this:

```jsx
<MapController
  view={View}
  layers={[Default, MNCountiesLayer, AlcoholLayerHeatmap]}
  width={`${width - filterWidth}`}
/>
```

The `view` prop is the base map powered by open maps. The OpenLayers library gives us a contructor to use that renders that default view.
The `layers` prop is an array of map layers. Layers at the beginning of the array are rendered first. Any layers added to this array are stacked on top of the previous one. OpenLayers, again, gives us contructors to use to create a layer from WMS data and render that layer on top of a view.
The `width` prop is passed in to indicate how wide the map can be. Currently the MapController is not using this prop but you may find it useful if you wanted start resizing the map or resizing the filters sidebar.

## React Readme

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
