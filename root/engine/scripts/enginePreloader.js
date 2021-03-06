
var EL = {
    assets: {
        shaderStrings: [],
        shaderPrograms: {},
        textures: {},
        models: {}
    },
    PreLoad: function (Callback) {
        console.log("ENGINE STARTUP");

        /********* Load other components *********/

        function InitEngineComponents() {

            // The font map is not dynamic - very specific to spritesheet I made.
            FontMap.Initialize();

            Callback();
        }

        /********* Load external files *********/

        // SHADERS
        var shaderNamesFilepaths = [
            // Specialty shaders
            ['ray', 'engine/assets/shaders/ray.vshdr', 'engine/assets/shaders/ray.fshdr'],
            ['guiBoxTint', 'engine/assets/shaders/guiBoxTint.vshdr', 'engine/assets/shaders/guiBoxTint.fshdr'],
            ['guiBoxTintTex', 'engine/assets/shaders/guiBoxTintTex.vshdr', 'engine/assets/shaders/guiBoxTintTex.fshdr'],
            ['guiText', 'engine/assets/shaders/guiText.vshdr', 'engine/assets/shaders/guiText.fshdr'],
            ['pntCol', 'engine/assets/shaders/pntCol.vshdr', 'engine/assets/shaders/pntCol.fshdr'],
            ['pntColTex', 'engine/assets/shaders/pntColTex.vshdr', 'engine/assets/shaders/pntColTex.fshdr'] // Special for textured particles

            /*
            ['col', 'engine/assets/shaders/col.vshdr', 'engine/assets/shaders/col.fshdr'],
            ['tex', 'engine/assets/shaders/tex.vshdr', 'engine/assets/shaders/tex.fshdr'],
            ['colTex', 'engine/assets/shaders/colTex.vshdr', 'engine/assets/shaders/colTex.fshdr']
            ['colTex', 'engine/assets/shaders/colTex.vshdr', 'engine/assets/shaders/colTex.fshdr']
            ['lightVert', 'engine/assets/shaders/vertLighting.vshdr', 'engine/assets/shaders/vertLighting.fshdr'],
            ['lightFrag', 'engine/assets/shaders/fragLighting.vshdr', 'engine/assets/shaders/fragLighting.fshdr'],
            ['colLightVert', 'engine/assets/shaders/colVertLighting.vshdr', 'engine/assets/shaders/colVertLighting.fshdr'],
            ['colLightFrag', 'engine/assets/shaders/colFragLighting.vshdr', 'engine/assets/shaders/colFragLighting.fshdr'],
            ['texLightVert', 'engine/assets/shaders/texVertLighting.vshdr', 'engine/assets/shaders/texVertLighting.fshdr'],
            ['texLightFrag', 'engine/assets/shaders/texFragLighting.vshdr', 'engine/assets/shaders/texFragLighting.fshdr'],
            ['colTexLightVert', 'engine/assets/shaders/colTexVertLighting.vshdr', 'engine/assets/shaders/colTexVertLighting.fshdr'],
            ['colTexLightFrag', 'engine/assets/shaders/colTexFragLighting.vshdr', 'engine/assets/shaders/colTexFragLighting.fshdr'],
            */
        ];
        // TEXTURE ASSETS
        var textureNamesFilepaths = [
            ['logo', 'engine/assets/images/logo.png'],
            ['starfield', 'engine/assets/images/starfield.jpg'],
            ['questionBlock', 'engine/assets/images/questionBlock.jpg'],
            ['lava', 'engine/assets/images/lavaTexture.jpg'],
            ['ice', 'engine/assets/images/iceTexture.jpg'],
            ['purply', 'engine/assets/images/purplePlanet.jpg'],
            ['star', 'engine/assets/images/star.png'],
            ['flower', 'engine/assets/images/flower.png'],
            ['fontMapBasic', 'engine/assets/images/FontSheetBasic.png'],
            ['fontMapBasicBold', 'engine/assets/images/FontSheetBasicBold.png']
        ];
        // JSON ASSETS
        var modelNamesFilepaths = [
            ['dimensionBox', 'engine/assets/models/DimensionTest_PositiveCube.json'],
            ['litUpCube', 'engine/assets/models/LightTestModels_MatCube.json']
        ];

        var that = this;
        function LoadModels() {
            FileUtils.LoadModels(modelNamesFilepaths, that.assets.models, InitEngineComponents);
        }
        function LoadTextures() {
            FileUtils.LoadTextures(textureNamesFilepaths, that.assets.textures, LoadModels);
        }

        // Load up everything first
        FileUtils.LoadShaders(shaderNamesFilepaths, this.assets.shaderStrings, LoadTextures);
    }
};