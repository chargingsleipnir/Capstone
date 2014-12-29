
var GL = {
    ctx: null,
    Initialize: function(contextWebGL) {
        /// <signature>
        ///  <summary>Initialize webGL by establisking context and preparing viewport</summary>
        ///  <param name="contextWebGL" type="context">the webGL context call from the canvas element</param>
        /// </signature>
        this.ctx = contextWebGL;
        this.ctx.clearColor(0.5, 0.4, 0.6, 1.0);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(this.ctx.LESS);
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
        this.ctx.lineWidth(3);
    },
    ReshapeWindow: function(width, height) {
        this.ctx.viewport(0.0, 0.0, width, height);
    },
    CreateShaderPrograms: function(shaderStrings, container) {
        /// <signature>
        ///  <summary>Create shader programs</summary>
        ///  <param name="shaderStrings" type="array2D [n][3]">name, vert, and frag strings</param>
        ///  <param name="container" type="object">An object to be mapped as <string, ShaderProgramIDs></param>
        /// </signature>

        // Always necessary to pass vars into private functions
        var ctx = this.ctx;

        function CreateShader(codeString, type) {
            var shader = ctx.createShader(type);
            ctx.shaderSource(shader, codeString);
            ctx.compileShader(shader);
            if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
                alert("in Program.createShader: \n" + codeString);
                throw ctx.getShaderInfoLog(shader);
            }
            return shader;
        }
        function CreateProgram(vertShaderString, fragShaderString) {
            var program = ctx.createProgram();
            var vertShader = CreateShader(vertShaderString, ctx.VERTEX_SHADER);
            var fragShader = CreateShader(fragShaderString, ctx.FRAGMENT_SHADER);
            ctx.attachShader(program, vertShader);
            ctx.attachShader(program, fragShader);
            ctx.linkProgram(program);
            if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
                alert("in createProgram");
                throw ctx.getProgramInfoLog(program);
            }

            var programData = new ShaderProgramData();

            programData.program = program;

            // Attributes will return their int location, -1 if not found
            programData.a_Pos = ctx.getAttribLocation(program, 'a_Pos');
            programData.a_Col = ctx.getAttribLocation(program, 'a_Col');
            programData.a_TexCoord = ctx.getAttribLocation(program, "a_TexCoord");
            programData.a_Norm = ctx.getAttribLocation(program, 'a_Norm');

            // Uniforms will return uniform object, null if not found
            programData.u_Tint = ctx.getUniformLocation(program, "u_Tint");
            programData.u_Sampler = ctx.getUniformLocation(program, "u_Sampler");
            programData.u_Alpha = ctx.getUniformLocation(program, "u_Alpha");
            // MATERIALS
            programData.u_DiffCol = ctx.getUniformLocation(program, "u_DiffCol");
            programData.u_DiffInt = ctx.getUniformLocation(program, "u_DiffInt");
            programData.u_SpecCol = ctx.getUniformLocation(program, "u_SpecCol");
            programData.u_SpecInt = ctx.getUniformLocation(program, "u_SpecInt");
            //ctx.getUniformLocation(program, "u_Specular_Hardness");
            //ctx.getUniformLocation(program, "u_Mirror_Color");
            //ctx.getUniformLocation(program, "u_Mirror_Distance");
            //ctx.getUniformLocation(program, "u_Mirror_Reflectivity");
            //ctx.getUniformLocation(program, "u_Shading_Ambient");
            //ctx.getUniformLocation(program, "u_Shading_Emit");
            //ctx.getUniformLocation(program, "u_Shading_Translucent");
            //ctx.getUniformLocation(program, "u_Darkness");
            // LIGHTS
            programData.u_AmbBright = ctx.getUniformLocation(program, "u_AmbBright");
            programData.u_DirBright = ctx.getUniformLocation(program, "u_DirBright");
            programData.u_DirDir = ctx.getUniformLocation(program, "u_DirDir");
            programData.u_PntBright = ctx.getUniformLocation(program, "u_PntBright");
            programData.u_PntPos = ctx.getUniformLocation(program, "u_PntPos");
            // MATRICES
            programData.u_MtxM = ctx.getUniformLocation(program, "u_MtxM");
            programData.u_MtxVP = ctx.getUniformLocation(program, "u_MtxVP");
            programData.u_MtxMVP = ctx.getUniformLocation(program, "u_MtxMVP");
            programData.u_MtxNorm = ctx.getUniformLocation(program, "u_MtxNorm");

            return programData;
        }

        // Load each program and map it to the string name given
        for (var i = 0; i < shaderStrings.length; i++)
            container[shaderStrings[i].name] = CreateProgram(shaderStrings[i].vert, shaderStrings[i].frag);
    },
    CreateBufferObjects: function(vertData, bufferData, isDynamic) {
        /// <signature>
        ///  <summary>Creates appropriate buffers from given model data</summary>
        ///  <param name="model" type="object">May be primitive, or imported</param>
        /// </signature>
        var drawType = this.ctx.STATIC_DRAW;
        if(isDynamic)
            drawType = this.ctx.DYNAMIC_DRAW;

        // Get appropriate set of verts based on whether or not indices can/will be used
        bufferData.numVerts = vertData.count;
        if (vertData.indices) {
            // Create and populate EABO
            bufferData.EABO = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, bufferData.EABO);
            this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertData.indices), drawType);
            // Get total vertex count
            bufferData.numVerts = vertData.indices.length;
        }

        // Create one long vert array, so only one buffer needs to be created and used
        var vertArray = vertData.posCoords;
        vertArray = vertArray.concat(vertData.colElems);
        vertArray = vertArray.concat(vertData.texCoords);
        vertArray = vertArray.concat(vertData.normAxes);
        var VAO = new Float32Array(vertArray);

        // Create VBO
        bufferData.VBO = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, bufferData.VBO);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, VAO, drawType);

        bufferData.VAOBytes = VAO.BYTES_PER_ELEMENT;
        bufferData.lenPosCoords = vertData.posCoords.length;
        bufferData.lenColElems = vertData.colElems.length;
        bufferData.lenTexCoords = vertData.texCoords.length;
        bufferData.lenNormAxes = vertData.normAxes.length;

        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
    },
    RewriteVAO: function(VBO, VAO) {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, VBO);
        this.ctx.bufferSubData(this.ctx.ARRAY_BUFFER, 0, VAO);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
    },
    RewriteIndexBuffer: function(EABO, indices) {
        if(!EABO)
            EABO = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, EABO);
        //this.ctx.bufferSubData(this.ctx.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(indices));
        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);
    },
    CreateTextureObject: function(texture, texFilter, outTexID) {
        var texID = outTexID ? outTexID : this.ctx.createTexture();
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texID);
        this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, true);
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, texture);

        if (texFilter == TextureFilters.nearest) {
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.NEAREST);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.NEAREST);
        }
        else if (texFilter == TextureFilters.linear) {
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
        }
        else if (texFilter == TextureFilters.mipmap) {
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR_MIPMAP_NEAREST);
            this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
        }

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
        return texID;


        /* Consider loading from an array of textures images
        for (var i in textureArray) {
            this.textures[i] = gl.createTexture();
            this.textures[i].image = textureArray[i];
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[i].image);
            // Might want to parameterize these to adjust quality.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }*/
    },
    GetDrawMethod: function(drawMethod) {
        /// <signature>
        ///  <summary>Get webGL Drawtype enum value</summary>
        ///  <param name="drawMethod" type="enum">Defined in structsEnumsConsts.js</param>
        /// </signature>
        switch (drawMethod) {
            case DrawMethods.points:
                return this.ctx.POINTS;
            case DrawMethods.lines:
                return this.ctx.LINES;
            case DrawMethods.triangles:
                return this.ctx.TRIANGLES;
            case DrawMethods.triangleFan:
                return this.ctx.TRIANGLE_FAN;
            case DrawMethods.triangleStrip:
                return this.ctx.TRIANGLE_STRIP;
            default:
                return this.ctx.TRIANGLES;
        }
    },
    RenderScene: function() {
        /// <signature>
        ///  <summary>Render every object in the scene</summary>
        /// </signature>
        var shdr;
        var buff;
        
        // Clear the scene for new draw call
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);

        var mtxVP = GM.activeCam.mtxCam.GetMultiply(GM.mtxProj);
        var mtxMVP;

        //var frustumTestCount = 0;
        var scene = SceneNetwork.GetActiveScene();

        for (var i = 0; i < scene.models.length; i++)
        //for (var i = 0; i < GM.models.length; i++)
        {
            if (GM.models[i].active && GM.frustum.IntersectsSphere(GM.models[i].drawSphere))
            {
                //frustumTestCount++;

                // These just allow everything to be better read
                shdr = GM.models[i].shaderData;
                buff = GM.models[i].bufferData;

                // USE PROGRAM AND VBO
                this.ctx.useProgram(shdr.program);
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                this.ctx.enableVertexAttribArray(shdr.a_Pos);
                this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);
                if (shdr.a_Col != -1) {
                    this.ctx.enableVertexAttribArray(shdr.a_Col);
                    this.ctx.vertexAttribPointer(shdr.a_Col, 3, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);
                }
                if (shdr.a_TexCoord != -1) {
                    this.ctx.enableVertexAttribArray(shdr.a_TexCoord);
                    this.ctx.vertexAttribPointer(shdr.a_TexCoord, 2, this.ctx.FLOAT, false, 0, (buff.lenPosCoords + buff.lenColElems) * buff.VAOBytes);
                    if (buff.texID) {
                        this.ctx.activeTexture(this.ctx.TEXTURE0);
                        this.ctx.bindTexture(this.ctx.TEXTURE_2D, buff.texID);
                        this.ctx.uniform1i(shdr.u_Sampler, 0);
                        // This 0 supposedly relates to the this.ctx.TEXTURE0, and up to 32 textures can be sent at once.
                    }
                }
                if (shdr.a_Norm != -1) {
                    this.ctx.enableVertexAttribArray(shdr.a_Norm);
                    this.ctx.vertexAttribPointer(shdr.a_Norm, 3, this.ctx.FLOAT, false, 0, (buff.lenPosCoords + buff.lenColElems + buff.lenTexCoords) * buff.VAOBytes);


                    /* If there's lighting, than the model and view-proj matrices
                     * are sent up independently. The lighting calculations require
                     * holding onto the verts modified from the model-matrix. */
                    this.ctx.uniformMatrix4fv(shdr.u_MtxM, false, GM.models[i].mtxModel.data);
                    this.ctx.uniformMatrix4fv(shdr.u_MtxVP, false, mtxVP.data);
                }
                else {
                    mtxMVP = GM.models[i].mtxModel.GetMultiply(mtxVP);
                    this.ctx.uniformMatrix4fv(shdr.u_MtxMVP, false, mtxMVP.data);
                }
                this.ctx.uniform3fv(shdr.u_Tint, GM.models[i].colourTint.GetData());

                // Draw calls
                if (buff.EABO) {
                    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                    this.ctx.drawElements(GM.models[i].drawMethod, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);
                }
                else {
                    this.ctx.drawArrays(GM.models[i].drawMethod, 0, buff.numVerts);
                }

                // Unbind buffers after use
                this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
            }
        }

        /******************* DEBUG DRAWING *************************/

        if (DebugManager.active) {

            // Debug models
            var dispObjs = [];
            if(DebugManager.dispOrientAxes) {
                dispObjs = scene.debug.dispObjs.orientAxes.models;
            }
            if(DebugManager.dispShells)
                dispObjs = dispObjs.concat(scene.debug.dispObjs.shells.models);

            for (var i = 0; i < dispObjs.length; i++)
            {
                if(dispObjs[i].active && GM.frustum.IntersectsSphere(dispObjs[i].drawSphere))
                {
                    //frustumTestCount++;

                    shdr = dispObjs[i].shaderData;
                    buff = dispObjs[i].bufferData;

                    // USE PROGRAM AND VBO
                    this.ctx.useProgram(shdr.program);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                    // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                    this.ctx.enableVertexAttribArray(shdr.a_Pos);
                    this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);
                    if (shdr.a_Col != -1) {
                        this.ctx.enableVertexAttribArray(shdr.a_Col);
                        this.ctx.vertexAttribPointer(shdr.a_Col, 3, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);
                    }

                    mtxMVP = dispObjs[i].mtxModel.GetMultiply(mtxVP);

                    // SEND UP UNIFORMS
                    this.ctx.uniformMatrix4fv(shdr.u_MtxMVP, false, mtxMVP.data);
                    //this.ctx.uniformMatrix4fv(shdr.u_MtxModel, false, dispObjs[i].mtxModel.data);
                    this.ctx.uniform3fv(shdr.u_Tint, dispObjs[i].colourTint.GetData());

                    // Draw calls
                    if (buff.EABO) {
                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                        this.ctx.drawElements(dispObjs[i].drawMethod, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);
                    }
                    else {
                        this.ctx.drawArrays(dispObjs[i].drawMethod, 0, buff.numVerts);
                    }

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                }
            }
            //console.log(frustumTestCount);


            // Ray casts
            if(DebugManager.dispRays) {
                dispObjs = scene.debug.dispObjs.rayCasts.rays;

                shdr = EL.assets.shaderPrograms['ray'];
                this.ctx.useProgram(shdr.program);

                for (var i = 0; i < dispObjs.length; i++) {
                    if (dispObjs[i].active) {

                        buff = dispObjs[i].bufferData;

                        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                        // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                        this.ctx.enableVertexAttribArray(shdr.a_Pos);
                        this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);

                        this.ctx.enableVertexAttribArray(shdr.a_Col);
                        this.ctx.vertexAttribPointer(shdr.a_Col, 3, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);

                        // SEND UP UNIFORMS
                        this.ctx.uniformMatrix4fv(shdr.u_MtxVP, false, mtxVP.data);
                        this.ctx.uniform3fv(shdr.u_Tint, dispObjs[i].colourTint.GetData());

                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                        this.ctx.drawElements(this.ctx.LINES, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);

                        // Unbind buffers after use
                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                    }
                }
            }
        }

        /******************* GUI DRAWING *************************/

        var guiSystems = GUINetwork.GetActiveSystems();

        // Text and boxes are drawn in the same loop so as to ensure that proper overlapping takes place.
        for(var sys in guiSystems) {
            for(var j = 0; j < guiSystems[sys].textBlocks.length; j++) {

                /******************* TEXT BOXES *************************/

                shdr = guiSystems[sys].boxMdls[j].shaderData;
                buff = guiSystems[sys].boxMdls[j].bufferData;

                this.ctx.useProgram(shdr.program);
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                this.ctx.enableVertexAttribArray(shdr.a_Pos);
                this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);

                // MAY HAVE TEXTURES - NO VERT COLOURS
                if (shdr.a_TexCoord != -1) {
                    this.ctx.enableVertexAttribArray(shdr.a_TexCoord);
                    this.ctx.vertexAttribPointer(shdr.a_TexCoord, 2, this.ctx.FLOAT, false, 0, (buff.lenPosCoords + buff.lenColElems) * buff.VAOBytes);
                    if (buff.texID) {
                        this.ctx.activeTexture(this.ctx.TEXTURE0);
                        this.ctx.bindTexture(this.ctx.TEXTURE_2D, buff.texID);
                        this.ctx.uniform1i(shdr.u_Sampler, 0);
                        // This 0 supposedly relates to the this.ctx.TEXTURE0, and up to 32 textures can be sent at once.
                    }
                }

                this.ctx.uniform3fv(shdr.u_Tint, guiSystems[sys].boxMdls[j].colourTint.GetData());
                this.ctx.uniform1f(shdr.u_Alpha, guiSystems[sys].boxMdls[j].alpha);

                this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                this.ctx.drawElements(this.ctx.TRIANGLES, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);

                // Unbind buffers after use
                this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);


                /******************* TEXT BLOCKS *************************/

                /* This shader is very specific to gui text, having no matrices, and with textures*/
                shdr = EL.assets.shaderPrograms['guiText'];
                buff = guiSystems[sys].textBlocks[j].bufferData;

                this.ctx.useProgram(shdr.program);
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                this.ctx.enableVertexAttribArray(shdr.a_Pos);
                this.ctx.vertexAttribPointer(shdr.a_Pos, 2, this.ctx.FLOAT, false, 0, 0);

                // ALWAYS HAS TEXTURES
                this.ctx.enableVertexAttribArray(shdr.a_TexCoord);
                this.ctx.vertexAttribPointer(shdr.a_TexCoord, 2, this.ctx.FLOAT, false, 0, (buff.lenPosCoords + buff.lenColElems) * buff.VAOBytes);

                this.ctx.activeTexture(this.ctx.TEXTURE0);
                this.ctx.bindTexture(this.ctx.TEXTURE_2D, buff.texID);
                this.ctx.uniform1i(shdr.u_Sampler, 0);

                this.ctx.uniform3fv(shdr.u_Tint, guiSystems[sys].textBlocks[j].colourTint.GetData());

                this.ctx.drawArrays(this.ctx.TRIANGLES, 0, buff.numVerts);

                // Unbind buffers after use
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
            }
        }
    }
};