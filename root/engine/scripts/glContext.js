
var testBool = true;

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
        //this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.lineWidth(3);

        this.CreateShaderPrograms(EL.assets.shaderStrings, EL.assets.shaderPrograms);
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
            programData.u_PntSize = ctx.getUniformLocation(program, "u_PntSize");
            // MATERIALS
            // Colour is multiplied by intensity immediately, before exporting model. No reason to hold values separately
            programData.u_DiffColWeight = ctx.getUniformLocation(program, "u_DiffColWeight");
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
            // For proper specular angling
            programData.u_CamPos = ctx.getUniformLocation(program, "u_CamPos");
            // MATRICES
            programData.u_MtxM = ctx.getUniformLocation(program, "u_MtxM");
            programData.u_MtxVP = ctx.getUniformLocation(program, "u_MtxVP");
            programData.u_MtxMVP = ctx.getUniformLocation(program, "u_MtxMVP");
            programData.u_MtxNorm = ctx.getUniformLocation(program, "u_MtxNorm");

            return programData;
        }

        if(container) {
            // Load each program and map it to the string name given
            for (var i = 0; i < shaderStrings.length; i++)
                container[shaderStrings[i].name] = CreateProgram(shaderStrings[i].vert, shaderStrings[i].frag);
        }
        else {
            return CreateProgram(shaderStrings.vert, shaderStrings.frag);
        }
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
    mtxModel: new Matrix4(),
    RenderJSONModel: function() {

    },
    RenderBasicShapes: function() {

    },
    RenderParticles: function() {

    },
    RenderGUIElemenets: function() {

    },
    RenderScene: function() {
        /// <signature>
        ///  <summary>Render every object in the scene</summary>
        /// </signature>
        var shdr;
        var buff;
        
        // Clear the scene for new draw call
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);

        var mtxVP = ViewMngr.activeCam.mtxCam.GetMultiply(ViewMngr.mtxProj);

        //var frustumTestCount = 0;
        var scene = SceneMngr.GetActiveScene();

        /******************* GameObject Models *************************/
        for (var i = 0; i < scene.models.length; i++)
        {
            if (scene.models[i].active)
            {
                if(ViewMngr.frustum.IntersectsSphere(scene.models[i].drawSphere)) {
                    //frustumTestCount++;

                    this.mtxModel.SetIdentity();
                    this.mtxModel.Transform(scene.models[i].trfm);

                    // These just allow everything to be better read
                    shdr = scene.models[i].shaderData;
                    buff = scene.models[i].bufferData;

                    if (testBool) {

                        if (i >= scene.models.length - 1)
                            testBool = false;
                    }

                    // USE PROGRAM AND VBO
                    this.ctx.useProgram(shdr.program);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                    // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                    this.ctx.enableVertexAttribArray(shdr.a_Pos);
                    this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);
                    if (shdr.a_Col != -1) {
                        this.ctx.enableVertexAttribArray(shdr.a_Col);
                        this.ctx.vertexAttribPointer(shdr.a_Col, 4, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);
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

                        // Diffuse
                        // Diff col and int are multiplied before exporting
                        this.ctx.uniform3fv(shdr.u_DiffColWeight, scene.models[i].mat.diff.colWeight);
                        // Specular
                        this.ctx.uniform3fv(shdr.u_SpecCol, scene.models[i].mat.spec.col);
                        this.ctx.uniform1f(shdr.u_SpecInt, scene.models[i].mat.spec.int);

                        //gl.uniform1f(shdr.u_Specular_Hardness, renderers[i].materials[0].specular.hardness);
                        // Mirror
                        //gl.uniform3fv(shdr.u_Mirror_Color, renderers[i].materials[0].mirror.color);
                        //gl.uniform1f(shdr.u_Mirror_Distance, renderers[i].materials[0].mirror.distance);
                        //gl.uniform1f(shdr.u_Mirror_Reflectivity, renderers[i].materials[0].mirror.reflectivity);
                        // Shading
                        //gl.uniform1f(shdr.u_Shading_Ambient, renderers[i].materials[0].shading.ambient);
                        //gl.uniform1f(shdr.u_Shading_Emit, renderers[i].materials[0].shading.emit);
                        //gl.uniform1f(shdr.u_Shading_Translucent, renderers[i].materials[0].shading.translucent);
                        // Other
                        this.ctx.uniform1f(shdr.u_Alpha, scene.models[i].mat.alpha);
                        //gl.uniform1f(shdr.u_Darkness, renderers[i].materials[0].darkness);

                        this.ctx.uniform1f(shdr.u_AmbBright, scene.light.amb.bright);
                        this.ctx.uniform1f(shdr.u_DirBright, scene.light.dir.bright);
                        this.ctx.uniform3fv(shdr.u_DirDir, scene.light.dir.dir.GetNegative().GetData());
                        this.ctx.uniform1f(shdr.u_PntBright, scene.light.pnt.bright);
                        this.ctx.uniform3fv(shdr.u_PntPos, scene.light.pnt.pos.GetData());
                        this.ctx.uniform3fv(shdr.u_CamPos, ViewMngr.activeCam.posGbl.GetData());


                        /* If there's lighting, than the model and view-proj matrices
                         * are sent up independently. The lighting calculations require
                         * holding onto the verts modified from the model-matrix. */
                        this.ctx.uniformMatrix4fv(shdr.u_MtxM, false, this.mtxModel.data);
                        this.ctx.uniformMatrix4fv(shdr.u_MtxVP, false, mtxVP.data);
                        // Normal Matrix  GetInvMtx3
                        var mtxNorm = this.mtxModel.GetInvMtx3();
                        mtxNorm.Transpose();
                        this.ctx.uniformMatrix3fv(shdr.u_MtxNorm, false, mtxNorm.data);
                    }
                    else {
                        this.mtxModel.SetMultiply(mtxVP);
                        this.ctx.uniformMatrix4fv(shdr.u_MtxMVP, false, this.mtxModel.data);
                    }
                    this.ctx.uniform4fv(shdr.u_Tint, scene.models[i].tint.GetData());

                    // Draw calls
                    if (buff.EABO) {
                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                        this.ctx.drawElements(scene.models[i].drawMethod, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);
                    }
                    else {
                        this.ctx.drawArrays(scene.models[i].drawMethod, 0, buff.numVerts);
                    }

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                    this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
                }
            }
        }


        /******************* DEBUG DRAWING *************************/

        if (DebugMngr.active) {

            // Debug models
            var dispObjs = [];
            if(DebugMngr.dispOrientAxes) {
                dispObjs = scene.debug.dispObjs.orientAxes.models;
            }
            if(DebugMngr.dispShells)
                dispObjs = dispObjs.concat(scene.debug.dispObjs.shells.models);
            if(DebugMngr.dispAxes)
                dispObjs.push(DebugMngr.axes);
            if(DebugMngr.dispGrid)
                dispObjs.push(DebugMngr.grid);

            for (var i = 0; i < dispObjs.length; i++)
            {
                if(dispObjs[i].active && ViewMngr.frustum.IntersectsSphere(dispObjs[i].drawSphere))
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
                        this.ctx.vertexAttribPointer(shdr.a_Col, 4, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);
                    }

                    this.mtxModel.SetIdentity();
                    this.mtxModel.Transform(dispObjs[i].trfm);
                    this.mtxModel.SetMultiply(mtxVP);

                    // SEND UP UNIFORMS
                    this.ctx.uniformMatrix4fv(shdr.u_MtxMVP, false, this.mtxModel.data);
                    this.ctx.uniform4fv(shdr.u_Tint, dispObjs[i].tint.GetData());

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
            if(DebugMngr.dispRays) {
                dispObjs = scene.debug.dispObjs.rayCasts.rays;

                shdr = EL.assets.shaderPrograms['ray'];
                this.ctx.useProgram(shdr.program);
                // This uniform can come out here because it's common to everything in this shader program
                this.ctx.uniformMatrix4fv(shdr.u_MtxVP, false, mtxVP.data);

                for (var i = 0; i < dispObjs.length; i++) {
                    if (dispObjs[i].active) {

                        buff = dispObjs[i].bufferData;

                        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                        // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                        this.ctx.enableVertexAttribArray(shdr.a_Pos);
                        this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);

                        this.ctx.enableVertexAttribArray(shdr.a_Col);
                        this.ctx.vertexAttribPointer(shdr.a_Col, 4, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);

                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                        this.ctx.drawElements(this.ctx.LINES, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);

                        // Unbind buffers after use
                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                    }
                }
            }
        }

        /******************* GameObject Particle Systems *************************/
        //var fieldCount = 0;
        for (var i = 0; i < scene.ptclSystems.length; i++)
        {
            // Always pull the active fields, as they could add and drop quite often
            var simpleFields = scene.ptclSystems[i].GetSimpleFields();

            this.mtxModel.SetIdentity();
            this.mtxModel.Transform(scene.ptclSystems[i].objGlobalTrfm);
            this.mtxModel.SetMultiply(mtxVP);

            // Used to shrink point size
            var dist = ViewMngr.activeCam.posGbl.GetSubtract(scene.ptclSystems[i].objGlobalTrfm.pos).GetMag();
            var distCalc = 1 - (dist / ViewMngr.farCullDist);

            for (var j = 0; j < simpleFields.length; j++)
            {
                if(simpleFields[j].active) {
                    //fieldCount++;

                    // Covers points, lines, and textured points
                    shdr = simpleFields[j].fieldHdlr.shaderData;
                    buff = simpleFields[j].fieldHdlr.bufferData;

                    this.ctx.useProgram(shdr.program);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                    // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                    this.ctx.enableVertexAttribArray(shdr.a_Pos);
                    this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);

                    this.ctx.enableVertexAttribArray(shdr.a_Col);
                    this.ctx.vertexAttribPointer(shdr.a_Col, 4, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);

                    if(buff.texID) {
                        this.ctx.activeTexture(this.ctx.TEXTURE0);
                        this.ctx.bindTexture(this.ctx.TEXTURE_2D, buff.texID);
                        this.ctx.uniform1i(shdr.u_Sampler, 0);
                    }

                    this.ctx.uniform1f(shdr.u_PntSize, simpleFields[j].fieldHdlr.pntSize * (distCalc * distCalc * distCalc));
                    this.ctx.uniformMatrix4fv(shdr.u_MtxMVP, false, this.mtxModel.data);

                    this.ctx.drawArrays(simpleFields[j].fieldHdlr.drawMethod, 0, buff.numVerts);

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                    this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
                }
            }

            var tails = scene.ptclSystems[i].GetTails();
            shdr = EL.assets.shaderPrograms['ray'];
            this.ctx.useProgram(shdr.program);
            this.ctx.uniformMatrix4fv(shdr.u_MtxVP, false, mtxVP.data);
            for (var j = 0; j < tails.length; j++)
            {
                if(tails[j].active) {
                    //fieldCount++;
                    // These just allow everything to be better read
                    buff = tails[j].trailHdlr.bufferData;

                    // USE PROGRAM AND VBO
                    this.ctx.useProgram(shdr.program);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff.VBO);

                    // SEND VERTEX DATA FROM BUFFER - Position, Colour, TextureCoords, Normals
                    this.ctx.enableVertexAttribArray(shdr.a_Pos);
                    this.ctx.vertexAttribPointer(shdr.a_Pos, 3, this.ctx.FLOAT, false, 0, 0);

                    this.ctx.enableVertexAttribArray(shdr.a_Col);
                    this.ctx.vertexAttribPointer(shdr.a_Col, 4, this.ctx.FLOAT, false, 0, buff.lenPosCoords * buff.VAOBytes);

                    this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, buff.numVerts);

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                }
            }
        }
        //console.log(fieldCount);


        /******************* GUI DRAWING *************************/

        var guiSystems = GUINetwork.GetActiveSystems();

        /* Disable depth testing to ensure proper message structure. Always draw the text immediately after the box
         * to ensure the two stay together, and the user must add their guiObjects in the order they want them to overlap. */
        this.ctx.disable(this.ctx.DEPTH_TEST);
        // Text and boxes are drawn in the same loop so as to ensure that proper overlapping takes place.
        for(var sys in guiSystems) {
            for(var j = 0; j < guiSystems[sys].textBlocks.length; j++) {

                /******************* TEXT BOXES *************************/
                if(guiSystems[sys].boxMdls[j].active) {

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

                    this.ctx.uniform4fv(shdr.u_Tint, guiSystems[sys].boxMdls[j].tint.GetData());

                    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                    this.ctx.drawElements(this.ctx.TRIANGLES, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                    this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
                }

                /******************* TEXT BLOCKS *************************/
                if(guiSystems[sys].textBlocks[j].active) {
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

                    this.ctx.uniform4fv(shdr.u_Tint, guiSystems[sys].textBlocks[j].tint.GetData());

                    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, buff.numVerts);

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                    this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
                }
            }
        }
        this.ctx.enable(this.ctx.DEPTH_TEST);
    },
    SpecialRayHdlr: null
};