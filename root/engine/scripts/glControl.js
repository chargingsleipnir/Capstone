
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
            programData.a_Pos = ctx.getAttribLocation(program, 'a_VertexPosition');
            programData.a_Col = ctx.getAttribLocation(program, 'a_VertexColor');
            programData.a_TexCoord = ctx.getAttribLocation(program, "a_TextureCoord");
            programData.a_Norm = ctx.getAttribLocation(program, 'a_VertexNormal');

            // Uniforms will return uniform object, null if not found
            programData.u_tint = ctx.getUniformLocation(program, "u_ColourTint");
            programData.u_Sampler = ctx.getUniformLocation(program, "u_Sampler");
            programData.u_Alpha = ctx.getUniformLocation(program, "u_Alpha");
            // MATERIALS
            programData.u_DiffCol = ctx.getUniformLocation(program, "u_Diffuse_Color");
            programData.u_DiffInt = ctx.getUniformLocation(program, "u_Diffuse_Intensity");
            programData.u_SpecCol = ctx.getUniformLocation(program, "u_Specular_Color");
            programData.u_SpecInt = ctx.getUniformLocation(program, "u_Specular_Intensity");
            //ctx.getUniformLocation(program, "u_Specular_Hardness");
            //ctx.getUniformLocation(program, "u_Mirror_Color");
            //ctx.getUniformLocation(program, "u_Mirror_Distance");
            //ctx.getUniformLocation(program, "u_Mirror_Reflectivity");
            //ctx.getUniformLocation(program, "u_Shading_Ambient");
            //ctx.getUniformLocation(program, "u_Shading_Emit");
            //ctx.getUniformLocation(program, "u_Shading_Translucent");
            //ctx.getUniformLocation(program, "u_Darkness");
            // LIGHTS
            programData.u_AmbBright = ctx.getUniformLocation(program, "u_Light_Ambient_Brightness");
            programData.u_DirBright = ctx.getUniformLocation(program, "u_Light_Directional_Brightness");
            programData.u_DirDir = ctx.getUniformLocation(program, "u_Light_Directional_Direction");
            programData.u_PntBright = ctx.getUniformLocation(program, "u_Light_Point_Brightness");
            programData.u_PntPos = ctx.getUniformLocation(program, "u_Light_Point_Position");
            // MATRICES
            programData.u_MtxModel = ctx.getUniformLocation(program, "u_Matrix_Model");
            programData.u_MtxProj = ctx.getUniformLocation(program, "u_Matrix_Projection");
            programData.u_MtxCam = ctx.getUniformLocation(program, "u_Matrix_Camera");
            programData.u_MtxNorm = ctx.getUniformLocation(program, "u_Matrix_Normal");

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
        bufferData.numVerts = vertData.posCoords.length / 3;
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
    CreateTextureObject: function(texture) {
        var texID = this.ctx.createTexture();
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texID);
        this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, true);
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, texture);
        // Might want to parameterize these to adjust quality.
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR_MIPMAP_NEAREST);
        this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
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

        //var frustumTestCount = 0;

        for (var i = 0; i < GM.models.length; i++)
        {
            // Change this on a per-object basis, with near and far using objects sphere
            // Frustum may come from just proj matrix, or from combo...
            /*
            var distToObj = GM.activeCam.obj.trfmGlobal.pos.GetSubtract(GM.models[i].drawSphere.pos).GetMag();
            var near = distToObj - GM.models[i].drawSphere.radius;
            var far = distToObj + GM.models[i].drawSphere.radius;
            GM.activeCam.mtxProj.SetPerspective(45.0, GM.wndWidth / GM.wndHeight, 0.1, 200);
            GM.activeCam.mtxProjView = GM.activeCam.mtxCam.GetMultiply(GM.activeCam.mtxProj);
            */

            //if (GM.models[i].active && GM.activeCam.frustum.IntersectsSphere(GM.models[i].drawSphere)) {
                //frustumTestCount++;
                //var dist = ((GM.models[i].drawSphere.pos).GetSubtract(GM.activeCam.trfm.pos)).GetMag();
                //console.log(dist);

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
                    else {
                        /*
                        this.ctx.disableVertexAttribArray(shdr.a_TexCoord);
                        var whiteTexture = this.ctx.createTexture();
                        this.ctx.bindTexture(this.TEXTURE_2D, whiteTexture);
                        var whitePixel = new Uint8Array([255, 255, 255, 255]);
                        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, 1, 1, 0, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, whitePixel);
                        */
                    }
                }
                if (shdr.a_Norm != -1) {
                    this.ctx.enableVertexAttribArray(shdr.a_Norm);
                    this.ctx.vertexAttribPointer(shdr.a_Norm, 3, this.ctx.FLOAT, false, 0, (buff.lenPosCoords + buff.lenColElems + buff.lenTexCoords) * buff.VAOBytes);
                }

                // SEND UP UNIFORMS
                this.ctx.uniformMatrix4fv(shdr.u_MtxCam, false, GM.activeCam.mtxProjView.data);
                this.ctx.uniformMatrix4fv(shdr.u_MtxModel, false, GM.models[i].mtxModel.data);
                this.ctx.uniform3fv(shdr.u_tint, GM.models[i].colourTint.GetData());

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
        //console.log(frustumTestCount);

        /*
        shdr = EM.assets.shaderPrograms['gui'].program;
        this.ctx.useProgram(shdr);

        for (var i = 0; i < DM.shapes.length; i++)
        {
            // These just allow everything to be better read

            buff = DM.shapes[i].bufferData;

            // USE PROGRAM AND VBO

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

            // SEND UP UNIFORMS
            this.ctx.uniformMatrix4fv(shdr.u_MtxModel, false, DM.shapes[i].mtxModel.data);
            this.ctx.uniform3fv(shdr.u_tint, DM.shapes[i].colourTint.GetData());

            // Draw calls
            if (buff.EABO) {
                this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                this.ctx.drawElements(DM.shapes[i].drawMethod, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);
            }
            else {
                this.ctx.drawArrays(DM.shapes[i].drawMethod, 0, buff.numVerts);
            }

            // Unbind buffers after use
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
        }
        */

        if (DM.GetActive()) {
            var dispObjs = DM.GetDispObjs.OrientAxes();
            dispObjs = dispObjs.concat(DM.GetDispObjs.BoundingShells());
            for (var i = 0; i < dispObjs.length; i++)
            {
                if(dispObjs[i].model.active) {

                    shdr = dispObjs[i].model.shaderData;
                    buff = dispObjs[i].model.bufferData;

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

                    // SEND UP UNIFORMS
                    this.ctx.uniformMatrix4fv(shdr.u_MtxCam, false, GM.activeCam.mtxProjView.data);
                    this.ctx.uniformMatrix4fv(shdr.u_MtxModel, false, dispObjs[i].model.mtxModel.data);
                    this.ctx.uniform3fv(shdr.u_tint, dispObjs[i].model.colourTint.GetData());

                    // Draw calls
                    if (buff.EABO) {
                        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff.EABO);
                        this.ctx.drawElements(dispObjs[i].model.drawMethod, buff.numVerts, this.ctx.UNSIGNED_SHORT, 0);
                    }
                    else {
                        this.ctx.drawArrays(dispObjs[i].model.drawMethod, 0, buff.numVerts);
                    }

                    // Unbind buffers after use
                    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, null);
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);
                }
            }
        }
    }
};