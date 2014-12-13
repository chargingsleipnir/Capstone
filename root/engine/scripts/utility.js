// Basic error messaging
window.onerror = function(msg, url, lineno) {
    alert(url + '\n(' + lineno + '): ' + msg);
    console.log(url + '\n(' + lineno + '): ' + msg);
};

var Utility = {
    // Load external assets
    LoadFile: function(file, Callback, noCache, isJSON) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 1) {
                if (isJSON)
                    request.overrideMimeType('application/json');
                else
                    request.overrideMimeType('text/plain');

                request.send();
            }
            else if (request.readyState == 4) {
                if (request.status == 200) {
                    Callback(request.responseText);
                }
                else if (request.status == 404) {
                    throw 'In loadFile(), File "' + file + '" does not exist.';
                }
                else {
                    alert(file + ": " + request.responseText);
                    throw 'XHR error ' + request.status + '.';
                }
            }
        };

        var url = file;
        if (noCache)
            url += '?' + (new Date()).getTime();

        request.open('GET', url, true);
    },
    LoadShaders: function(nameFilePathSets, container, Callback) {
        /// <signature>
        ///  <summary>Load and map sets of two shader files</summary>
        ///  <param name="filePathSets" type="array2D [n][3]">name, vert, and frag filepath strings</param>
        ///  <param name="containerArray" type="array">An array to be filled with ShaderFilePair objects</param>
        ///  <param name="Callback" type="function">the function to call once loading has completed</param>
        /// </signature>
        var NAME = 0;
        var fileIndex = 1;
        var shaderIndex = -1;
        var msg_LoadFinished;

        function LoadRecursion(asset) {
            /// <signature>
            ///  <summary>Recursively load given assets</summary>
            ///  <param name="asset" type="string">the asset to be loaded into the map, send a load completion message first</param>
            /// </signature>
            if (shaderIndex == -1) {
                msg_LoadFinished = asset;
            }
            // fileindex will waver between 1 and 2, so the shader index increases only every other call to the function.
            else {
                if (fileIndex == 1) {
                    container[shaderIndex] = new ShaderFilePair();
                    container[shaderIndex].name = nameFilePathSets[shaderIndex][NAME];
                    container[shaderIndex].vert = asset;
                    shaderIndex--;
                    fileIndex++;
                }
                else {
                    container[shaderIndex].frag = asset;
                    fileIndex--;
                }
            }
            shaderIndex++;
            if (shaderIndex < nameFilePathSets.length)
                Utility.LoadFile(nameFilePathSets[shaderIndex][fileIndex], LoadRecursion, true, false);
            else {
                console.log(msg_LoadFinished);
                Callback();
            }
        }
        LoadRecursion('Loading Shaders Complete');
    },
    LoadTextures: function(nameFilePathPairs, containerObj, Callback) {
        /// <signature>
        ///  <summary>Load and map sets of two shader files</summary>
        ///  <param name="nameFilePathPairs" type="array2D" [n][2]>string names and filepaths</param>
        ///  <param name="containerObj" type="object">An empty object to be filled as map<string, texture></param>
        ///  <param name="Callback" type="function">the function to call once loading has completed</param>
        /// </signature>
        var NAME = 0, FILEPATH = 1;
        var textureIndex = -1;
        var msg_LoadFinished;

        function LoadRecursion(asset) {
            /// <signature>
            ///  <summary>Recursively load given assets</summary>
            ///  <param name="asset" type="string">the asset to be loaded into the map, send a load completion message first</param>
            /// </signature>
            if (textureIndex == -1)
                msg_LoadFinished = asset;
            else 
                containerObj[nameFilePathPairs[textureIndex][NAME]] = asset;

            textureIndex++;
            if (textureIndex < nameFilePathPairs.length) {
                var image = new Image();
                // function required to be inside this function call to act as a true callback
                image.onload = function() { LoadRecursion(image) };
                // Image dimensions must be power of 2 (32x32, 128x128, etc.)
                image.src = nameFilePathPairs[textureIndex][FILEPATH];
            }
            else {
                console.log(msg_LoadFinished);
                Callback();
            }
        }
        LoadRecursion('Loading Textures Complete');
    },
    LoadModels: function(nameFilePathPairs, containerObj, Callback) {
        /// <signature>
        ///  <summary>Load and map sets of two shader files</summary>
        ///  <param name="nameFilePathPairs" type="array2D [n][2]">string names and filepaths</param>
        ///  <param name="containerObj" type="object">An empty object to be filled as map<string, texture></param>
        ///  <param name="Callback" type="function">the function to call once loading has completed</param>
        /// </signature>
        var NAME = 0, FILEPATH = 1;
        var modelIndex = -1;
        var msg_LoadFinished;

        function LoadRecursion(asset) {
            /// <signature>
            ///  <summary>Recursively load given assets</summary>
            ///  <param name="asset" type="string">the asset to be loaded into the map, send a load completion message first</param>
            /// </signature>
            if (modelIndex == -1)
                msg_LoadFinished = asset;
            else
                containerObj[nameFilePathPairs[modelIndex][NAME]] = JSON.parse(asset);

            modelIndex++;
            if (modelIndex < nameFilePathPairs.length) {
                Utility.LoadFile(nameFilePathPairs[modelIndex][FILEPATH], LoadRecursion, true, true);
            }
            else {
                console.log(msg_LoadFinished);
                Callback();
            }
        }
        LoadRecursion('Loading Models Complete');
    },
    AssignShaderProgram: function(model) {
        /// <signature>
        ///  <summary>Examines the model's data and returns the last appropriate shader found</summary>
        ///  <param name="model" type="object"></param>
        ///  <returns type="shaderProgram" />
        /// </signature>

        // Decide on shader program here, based on data coming in
        var colour = false,
            texture = false,
            light = false;

        // Determine which attributes can even be supported
        if (model.vertices.byMesh.colElems.length > 0 || model.vertices.byFaces.colElems.length > 0) colour = true;
        if (model.vertices.byMesh.texCoords.length > 0 || model.vertices.byFaces.texCoords.length > 0) texture = true;
        if (model.materials.length > 0) light = true;

        var matches = [];
        // Find best match - eliminate those shaders that DO have attributes we DON'T want
        console.log("Shaders appropriate for model \"" + model.name + "\":");
        for (var shdr in EM.assets.shaderPrograms) {
            if (!colour && EM.assets.shaderPrograms[shdr].a_Col != -1) continue;
            if (!texture && EM.assets.shaderPrograms[shdr].a_TexCoord != -1) continue;
            if (!light && EM.assets.shaderPrograms[shdr].a_Norm != -1) continue;
            matches.push(EM.assets.shaderPrograms[shdr]);
            console.log(shdr);
        }
        // Return the last match, for now.
        return matches[matches.length - 1];
    }
}