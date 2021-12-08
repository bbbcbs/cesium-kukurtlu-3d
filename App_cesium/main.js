// Get your own Bing Maps API key at https://www.bingmapsportal.com, prior to publishing your Cesium application:
Cesium.BingMapsApi.defaultKey = 'put your API key here';

// Construct the default list of terrain sources.
var terrainModels = Cesium.createDefaultTerrainProviderViewModels();

// Construct the viewer with just what we need for this base application
var viewer = new Cesium.Viewer('cesiumContainer', {
	timeline:false,
	animation:false,
	vrButton:true,
	sceneModePicker:false,
	infoBox:true,
	scene3DOnly:true,
	terrainProviderViewModels: terrainModels,
	selectedTerrainProviderViewModel: terrainModels[1]  // Select STK high-res terrain
});

// No depth testing against the terrain to avoid z-fighting
viewer.scene.globe.depthTestAgainstTerrain = false;

// Add credit to Bentley
viewer.scene.frameState.creditDisplay.addDefaultCredit(new Cesium.Credit('Cesium 3D Tiles produced by Bentley ContextCapture', 'Resources/logoBentley.png', 'http://www.bentley.com/'));

// Bounding sphere
var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(29.03022677, 40.2029756, 173.7731892), 822.1123062);

// Override behavior of home button
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
	// Fly to custom position
	viewer.camera.flyToBoundingSphere(boundingSphere);

	// Tell the home button not to do anything
	commandInfo.cancel = true;
});

// Set custom initial position
viewer.camera.flyToBoundingSphere(boundingSphere, {duration: 0});

/*---------------------------------------------------------------------------------**//**
* @bsimethod
+---------------+---------------+---------------+---------------+---------------+------*/
// Functions to adapt screen space error and memory use to the device
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

// Add tileset. Do not forget to reduce the default screen space error to 1
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
	url: '../Scene/Production_1.json',
	maximumScreenSpaceError : isMobile.any() ? 8 : 1, // Temporary workaround for low memory mobile devices - Increase maximum error to 8.
	maximumNumberOfLoadedTiles : isMobile.any() ? 10 : 1000 // Temporary workaround for low memory mobile devices - Decrease (disable) tile cache.
}));
