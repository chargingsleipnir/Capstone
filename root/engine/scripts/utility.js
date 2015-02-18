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
        for (var shdr in EL.assets.shaderPrograms) {
            if (!colour && EL.assets.shaderPrograms[shdr].a_Col != -1) continue;
            if (!texture && EL.assets.shaderPrograms[shdr].a_TexCoord != -1) continue;
            if (!light && EL.assets.shaderPrograms[shdr].a_Norm != -1) continue;
            matches.push(EL.assets.shaderPrograms[shdr]);
        }
        // Return the last match, for now.
        return matches[matches.length - 1];
    },
    BuildShaderProgram: function(vertData, materials, usesFragLighting) {
        /// <signature>
        ///  <summary>Examines the model's data and build the appropriate shader program strings. Only for 3D GameObject models</summary>
        ///  <param name="vertData" type="object">Vertex data from model, either from entire mesh, or per face</param>
        ///  <param name="materials" type="object">Material from model</param>
        ///  <param name="outVshdrStr" type="string">Empty string container to contain the vertex shader</param>
        ///  <param name="outFshdrStr" type="string">Empty string container to contain the fragment shader</param>
        ///  <param name="usesFragLighting" type="bool">If false, light data will be calculated in the vertex shader</param>
        ///  <returns type="void" />
        /// </signature>

        var vshdrStr, fshdrStr;

        // Decide on shader program here, based on data coming in
        var colour = vertData.colElems.length > 0,
            texture = vertData.texCoords.length > 0,
            light = materials.length > 0;

        var declaration, mainFunc, fragColour;


        /******************** VERTEX SHADER ********************/

        declaration = ShdrLines.attr.pos;

        mainFunc = ShdrLines.main.start;
        mainFunc += ShdrLines.main.pntSize;

        if(colour) {
            declaration += ShdrLines.attr.col;
            declaration += ShdrLines.vary.col;

            mainFunc += ShdrLines.vary.sendCol;
        }
        if(texture) {
            declaration += ShdrLines.attr.tex;
            declaration += ShdrLines.vary.tex;

            mainFunc += ShdrLines.vary.sendTex;
        }
        if(!light) {
            declaration += ShdrLines.unif.mtxMVP;
            mainFunc += ShdrLines.main.glPos.MVP;
        }
        else {

            /*
            if(ViewMngr.lightProps.useFragLighting) {

            }
            if(ViewMngr.lightProps.model == LightModels.phong) {

            }
            else if(ViewMngr.lightProps.model == LightModels.blinnPhong) {

            }
            else if(ViewMngr.lightProps.model == LightModels.toon) {

            }
            */

            declaration += ShdrLines.attr.norm;

            if(!usesFragLighting) {

                declaration += ShdrLines.vary.light;
                declaration += ShdrLines.unif.lighting;
                declaration += ShdrLines.unif.camPos;

                mainFunc += "vec4 " + ShdrLines.vary.sendPos;
                mainFunc += ShdrLines.main.glPos.Split;
                mainFunc += "vec3 " + ShdrLines.vary.sendNorm;
                mainFunc += ShdrLines.main.lighting;
                mainFunc += ShdrLines.vary.sendLight;
            }
            else {
                declaration += ShdrLines.vary.pos;
                declaration += ShdrLines.vary.norm;

                mainFunc += ShdrLines.vary.sendPos;
                mainFunc += ShdrLines.main.glPos.Split;
                mainFunc += ShdrLines.vary.sendNorm;
            }


            declaration += ShdrLines.unif.mtxM;
            declaration += ShdrLines.unif.mtxVP;
            declaration += ShdrLines.unif.mtxNorm;
        }

        mainFunc += ShdrLines.main.end;

        vshdrStr = '' + declaration + mainFunc;
        //console.log("////////////////////////////////////////////////////////////");
        //console.log(vshdrStr);

        /******************** FRAGMENT SHADER ********************/

        declaration = ShdrLines.prec.medF;

        mainFunc = ShdrLines.main.start;

        fragColour = ShdrLines.main.glFrag.start;
        fragColour += "(" + ShdrLines.main.glFrag.tintCol;

        if(colour) {
            declaration += ShdrLines.vary.col;

            fragColour += ShdrLines.main.glFrag.col;
        }
        if(texture) {
            declaration += ShdrLines.vary.tex;
            declaration += ShdrLines.unif.sampler;

            mainFunc += ShdrLines.main.texCol;

            fragColour += ShdrLines.main.glFrag.texCol;
        }
        if(!light) {
            fragColour += ")";
        }
        else {
            if(!usesFragLighting) {
                declaration += ShdrLines.vary.light;
            }

            else {
                declaration += ShdrLines.vary.pos;
                declaration += ShdrLines.vary.norm;
                declaration += ShdrLines.unif.lighting;
                declaration += ShdrLines.unif.camPos;

                mainFunc += ShdrLines.main.normalizeNorm;
                mainFunc += ShdrLines.main.lighting.replace("v_TrfmNorm", "normal");
                mainFunc += "vec3 " + ShdrLines.vary.sendLight;
            }
            fragColour += ")";
            fragColour += ShdrLines.main.glFrag.light;
        }

        fragColour += ShdrLines.main.glFrag.alphaStart;
        if(colour)
            fragColour += ShdrLines.main.glFrag.colA;
        if(texture)
            fragColour += ShdrLines.main.glFrag.texA;
        fragColour += ShdrLines.main.glFrag.end;

        declaration += ShdrLines.unif.tint;

        mainFunc += fragColour;
        mainFunc += ShdrLines.main.end;

        fshdrStr = '' + declaration + mainFunc;
        console.log("---------------------");
        console.log(fshdrStr);

        return GL.CreateShaderPrograms(new ShaderFilePair('', vshdrStr, fshdrStr));
    }
};

var TextUtils = {
    MeasureText: function(string, fontSizeW) {
        return string.length * fontSizeW;
    },
    CreateBoundTextBlock: function(string, charW, charH, lineSpacing, maxW, maxH, outArray) {
        var strToParse = string.replace("\n", " ");

        var charMax = (maxW / charW);
        charMax = Math.floor(charMax);

        var lineToAdd = '';
        var lastSpaceIdx = 0;

        var maxLines = maxH / (charH + lineSpacing);
        maxLines = Math.floor(maxLines);
        var numLines = 0;

        while(numLines < maxLines) {
            numLines++;
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
                else {
                    // Subtract 1 to eliminate the space that was found, making right-alignment possible
                    lineToAdd = strToParse.substr(0, lastSpaceIdx-1);
                }
                outArray.push(lineToAdd);
            }

            strToParse = strToParse.slice(lastSpaceIdx);
        }
    }
};

var WndUtils = {
    WndX_To_GLNDCX: function(wndX) {
        return wndX / (0.5 * ViewMngr.wndWidth);
    },
    WndY_To_GLNDCY: function(wndY) {
        return wndY / (0.5 * ViewMngr.wndHeight);
    }
};

var RefUtils = {
    Swap: function(arr, idx1, idx2) {
        var temp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = temp;
    }
};