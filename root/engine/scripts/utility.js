// Basic error messaging
window.onerror = function(msg, url, lineno) {
    alert(url + '\n(' + lineno + '): ' + msg);
    console.log(url + '\n(' + lineno + '): ' + msg);
};

var FileUtils = {
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
                FileUtils.LoadFile(nameFilePathSets[shaderIndex][fileIndex], LoadRecursion, true, false);
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
                FileUtils.LoadFile(nameFilePathPairs[modelIndex][FILEPATH], LoadRecursion, true, true);
            }
            else {
                console.log(msg_LoadFinished);
                Callback();
            }
        }
        LoadRecursion('Loading Models Complete');
    }
};

var MathUtils = {
    GetCofactor: function(tl, br, bl, tr) {
        return (tl * br) - (bl * tr);
    },
    GetGreatestDouble: function(value, startNum) {
        var out = startNum || 1;
        while (out < value) {
            out *= 2;
        }
        return out;
    }
};

var GeomUtils = {
     /*
     IsConvexQuad: function(quadPtA, quadPtB, quadPtC, quadPtD) {
     /// <signature>
     ///  <summary>Returns true is quad is convex</summary>
     ///  <returns type="bool" />
     /// </signature>

     var bda = Vector3.CrossProduct(Vector3.Subtract(quadPtD, quadPtB), Vector3.Subtract(quadPtA, quadPtB));
     var bdc = Vector3.CrossProduct(Vector3.Subtract(quadPtD, quadPtB), Vector3.Subtract(quadPtC, quadPtB));

     if (Vector3.DotProduct(bda, bdc) >= 0.0)
     return 0;

     var acd = Vector3.CrossProduct(Vector3.Subtract(quadPtC, quadPtA), Vector3.Subtract(quadPtD, quadPtA));
     var acb = Vector3.CrossProduct(Vector3.Subtract(quadPtC, quadPtA), Vector3.Subtract(quadPtB, quadPtA));

     return Vector3.DotProduct(acd, acb) < 0.0;
     },
     */
    GetShapeData3D: function (coords, centre) {
        /// <signature>
        ///  <summary>Returns the object provided, sized to wrap around the vertices provided</summary>
        ///  <param name="allPosCoords" type="[]">entire list of vertex positions, as decimals, in x, y, z order</param>
        ///  <returns type="Object" />
        /// </signature>
        var shape = new AAShapeData3D();
        shape.min.SetValues(coords[0], coords[1], coords[2]);
        shape.max.SetCopy(shape.min);
        var squaredLength = shape.min.GetMagSqr();
        for (var i = 0; i < coords.length; i += 3) {
            shape.max.x = (coords[i] > shape.max.x) ? coords[i] : shape.max.x;
            shape.min.x = (coords[i] < shape.min.x) ? coords[i] : shape.min.x;
            shape.max.y = (coords[i + 1] > shape.max.y) ? coords[i + 1] : shape.max.y;
            shape.min.y = (coords[i + 1] < shape.min.y) ? coords[i + 1] : shape.min.y;
            shape.max.z = (coords[i + 2] > shape.max.z) ? coords[i + 2] : shape.max.z;
            shape.min.z = (coords[i + 2] < shape.min.z) ? coords[i + 2] : shape.min.z;
        }

        shape.RecalculateDimensions();

        if(centre) {
            for (var i = 0; i < coords.length; i += 3) {
                coords[i] -= shape.centre.x;
                coords[i + 1] -= shape.centre.y;
                coords[i + 2] -= shape.centre.z;
            }
            shape.centre.SetZero();
            shape.RecalculateExtents();
        }

        // Go over all vertices again to get most accurate radius
        for (var i = 0; i < coords.length; i += 3) {
            var tempLength = (new Vector3(coords[i] - shape.centre.x, coords[i + 1] - shape.centre.y, coords[i + 2] - shape.centre.z)).GetMagSqr();
            squaredLength = (tempLength > squaredLength) ? tempLength : squaredLength;
        }
        shape.radius = Math.sqrt(squaredLength);

        return shape;
    }
};

var ModelUtils = {
    SelectVAOData: function(vertSets) {
        if (vertSets.byFaces.colElems.length > 0 || vertSets.byFaces.texCoords.length > 0) {
            return vertSets.byFaces;
        }
        return vertSets.byMesh;
    },
    AssignShaderProgram: function(vertData, materials) {
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
        if (vertData.colElems.length > 0) colour = true;
        if (vertData.texCoords.length > 0) texture = true;
        if (materials.length > 0) light = true;

        var matches = [];
        // Find best match - eliminate those shaders that DO have attributes we DON'T want
        for (var shdr in EM.assets.shaderPrograms) {
            if (!colour && EM.assets.shaderPrograms[shdr].a_Col != -1) continue;
            if (!texture && EM.assets.shaderPrograms[shdr].a_TexCoord != -1) continue;
            if (!light && EM.assets.shaderPrograms[shdr].a_Norm != -1) continue;
            matches.push(EM.assets.shaderPrograms[shdr]);
        }
        // Return the last match, for now.
        return matches[matches.length - 1];
    }
};

var TextUtils = {
    GetTexCoords: function(char) {
        // For textures, specify row and col from bottom-left to top-right
        var eigth = 0.125;
        function GetCoordsByIndex(row, col) {
            return [
                row * eigth, (col+1) * eigth,
                row * eigth, col * eigth,
                (row+1) * eigth, col * eigth,

                row * eigth, (col+1) * eigth,
                (row+1) * eigth, col * eigth,
                (row+1) * eigth, (col+1) * eigth
            ];
        }

        switch (char) {
            case 'A': return GetCoordsByIndex(0, 7) ;
            case 'B': return GetCoordsByIndex(1, 7) ;
            case 'C': return GetCoordsByIndex(2, 7) ;
            case 'D': return GetCoordsByIndex(3, 7) ;
            case 'E': return GetCoordsByIndex(4, 7) ;
            case 'F': return GetCoordsByIndex(5, 7) ;
            case 'G': return GetCoordsByIndex(6, 7) ;
            case 'H': return GetCoordsByIndex(7, 7) ;
            case 'I': return GetCoordsByIndex(0, 6) ;
            case 'J': return GetCoordsByIndex(1, 6) ;
            case 'K': return GetCoordsByIndex(2, 6) ;
            case 'L': return GetCoordsByIndex(3, 6) ;
            case 'M': return GetCoordsByIndex(4, 6) ;
            case 'N': return GetCoordsByIndex(5, 6) ;
            case 'O': return GetCoordsByIndex(6, 6) ;
            case 'P': return GetCoordsByIndex(7, 6) ;
            case 'Q': return GetCoordsByIndex(0, 5) ;
            case 'R': return GetCoordsByIndex(1, 5) ;
            case 'S': return GetCoordsByIndex(2, 5) ;
            case 'T': return GetCoordsByIndex(3, 5) ;
            case 'U': return GetCoordsByIndex(4, 5) ;
            case 'V': return GetCoordsByIndex(5, 5) ;
            case 'W': return GetCoordsByIndex(6, 5) ;
            case 'X': return GetCoordsByIndex(7, 5) ;
            case 'Y': return GetCoordsByIndex(0, 4) ;
            case 'Z': return GetCoordsByIndex(1, 4) ;
            case '0': return GetCoordsByIndex(2, 4) ;
            case '1': return GetCoordsByIndex(3, 4) ;
            case '2': return GetCoordsByIndex(4, 4) ;
            case '3': return GetCoordsByIndex(5, 4) ;
            case '4': return GetCoordsByIndex(6, 4) ;
            case '5': return GetCoordsByIndex(7, 4) ;
            case '6': return GetCoordsByIndex(0, 3) ;
            case '7': return GetCoordsByIndex(1, 3) ;
            case '8': return GetCoordsByIndex(2, 3) ;
            case '9': return GetCoordsByIndex(3, 3) ;
            case '.': return GetCoordsByIndex(4, 3) ;
            case ' ': return GetCoordsByIndex(5, 3) ;
            case 'a': return GetCoordsByIndex(6, 3) ;
            case 'b': return GetCoordsByIndex(7, 3) ;
            case 'c': return GetCoordsByIndex(0, 2) ;
            case 'd': return GetCoordsByIndex(1, 2) ;
            case 'e': return GetCoordsByIndex(2, 2) ;
            case 'f': return GetCoordsByIndex(3, 2) ;
            case 'g': return GetCoordsByIndex(4, 2) ;
            case 'h': return GetCoordsByIndex(5, 2) ;
            case 'i': return GetCoordsByIndex(6, 2) ;
            case 'j': return GetCoordsByIndex(7, 2) ;
            case 'k': return GetCoordsByIndex(0, 1) ;
            case 'l': return GetCoordsByIndex(1, 1) ;
            case 'm': return GetCoordsByIndex(2, 1) ;
            case 'n': return GetCoordsByIndex(3, 1) ;
            case 'o': return GetCoordsByIndex(4, 1) ;
            case 'p': return GetCoordsByIndex(5, 1) ;
            case 'q': return GetCoordsByIndex(6, 1) ;
            case 'r': return GetCoordsByIndex(7, 1) ;
            case 's': return GetCoordsByIndex(0, 0) ;
            case 't': return GetCoordsByIndex(1, 0) ;
            case 'u': return GetCoordsByIndex(2, 0) ;
            case 'v': return GetCoordsByIndex(3, 0) ;
            case 'w': return GetCoordsByIndex(4, 0) ;
            case 'x': return GetCoordsByIndex(5, 0) ;
            case 'y': return GetCoordsByIndex(6, 0) ;
            case 'z': return GetCoordsByIndex(7, 0) ;
        }
    },
    MeasureText: function(string, fontSizeW) {
        return string.length * fontSizeW;
    },
    CreateBoundTextBlock: function(string, fontSize, lineSpacing, maxW, maxH, outArray) {
        var strToParse = string.replace("\n", " ");
        var charMax = (maxW / fontSize);
        charMax = Math.ceil(charMax);
        var lineToAdd = '';
        var lastSpaceIdx = 0;

        while(true) {
            // max line of text that could be used
            var fullLine = strToParse.substr(0, charMax);

            // For the final line
            if(fullLine.length < charMax) {
                outArray.push(fullLine);
                break;
            }

            // Use full line if next char is a space
            if(strToParse.charAt(charMax) == ' ') {
                outArray.push(fullLine);
                lastSpaceIdx = charMax + 1;
            }
            else {
                // Otherwise find the last space and use everything up to there
                lastSpaceIdx = fullLine.lastIndexOf(' ') + 1;
                // Comes up zero if there are no more spaces\
                if (lastSpaceIdx == 0) {
                    // This means there's no other space detected just because the word is too long
                    if(strToParse.length >= charMax)
                        lastSpaceIdx = charMax;
                    else {
                        outArray.push(strToParse.slice(0, charMax));
                        break;
                    }
                    lineToAdd = strToParse.slice(0, charMax);
                }
                else
                    lineToAdd = strToParse.substr(0, lastSpaceIdx);
                outArray.push(lineToAdd);
            }

            strToParse = strToParse.slice(lastSpaceIdx);
        }
    }
};

var WndUtils = {
    WndX_To_GLNDCX: function(wndX) {
        return wndX / (0.5 * GM.wndWidth);
    },
    WndY_To_GLNDCY: function(wndY) {
        return wndY / (0.5 * GM.wndHeight);
    }
};