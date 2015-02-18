
/******************* MODELS *************************/

function ModelHandler(model, trfmGlobal, radius) {
    console.log("\n*****" + model.name + "*****\n");

    // Decide whether to draw with Elements or not
    this.vertData = ModelUtils.SelectVAOData(model.vertices);

    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(this.vertData, this.bufferData, false);

    this.shaderData = ModelUtils.BuildShaderProgram(this.vertData, model.materials, true);

    if(model.materials[0]) {
        this.mat = model.materials[0];
        this.tint = new Vector4(0.0, 0.0, 0.0, model.materials[0].alpha);
    }
    else {
        this.tint = new Vector4(0.0, 0.0, 0.0, 1.0);
    }

    // Get draw method.
    if(model.hasOwnProperty('drawMethod'))
        this.drawMethod = GL.GetDrawMethod(model.drawMethod);
    else
        this.drawMethod = GL.GetDrawMethod(DrawMethods.triangles);

    this.active = true;
    this.trfm = trfmGlobal;
    // This is specifically set this way for frustum culling. No need to be more dynamic
    this.drawSphere = new Sphere(trfmGlobal.pos, radius);

    // Hold just indices for now, so as to rewrite if necessary, to create wire frames
    this.indices = model.vertices.byMesh.indices;
}
ModelHandler.prototype = {
    SetTintRGB: function(r, g, b) {
        this.tint.SetVec3(r, g, b);
    },
    SetTintAlpha: function(a) {
        this.tint.SetW(a);
    },
    SetTexture: function(texture, texFilter) {
        this.bufferData.texID = GL.CreateTextureObject(texture, texFilter);
    },
    MakeWireFrame: function() {
        // Change draw type
        this.drawMethod = GL.GetDrawMethod(DrawMethods.lines);
        // provide new list of indices that are essentially just duplicated
        var newIndices = [];
        for(var i = 0; i < this.indices.length; i+=3) {
            newIndices.push(this.indices[i]);
            newIndices.push(this.indices[i+1]);
            newIndices.push(this.indices[i+1]);
            newIndices.push(this.indices[i+2]);
            newIndices.push(this.indices[i+2]);
            newIndices.push(this.indices[i]);
        }
        // Change buffer to reflect new set
        GL.RewriteIndexBuffer(this.bufferData.EABO, newIndices);
        this.bufferData.numVerts = newIndices.length;
    },
    MakePointSet: function() {
        this.drawMethod = GL.GetDrawMethod(DrawMethods.points);
    },
    RewriteVerts: function(vertArray) {
        GL.RewriteVAO(this.bufferData.VBO, new Float32Array(vertArray));
    }
};


/******************* PARTICLE FIELD HANDLER *************************/

function PtclFieldHandler(pntVerts, drawMethod) {
    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(pntVerts, this.bufferData, true);

    this.drawMethod = GL.GetDrawMethod(drawMethod);

    this.shaderData = EL.assets.shaderPrograms['pntCol'];

    this.pntSize = 5.0;
}
PtclFieldHandler.prototype = {
    SetTexture: function(texture, texFilter) {
        this.bufferData.texID = GL.CreateTextureObject(texture, texFilter);
        this.shaderData = EL.assets.shaderPrograms['pntColTex'];
    },
    RewriteVerts: function(vertArray) {
        GL.RewriteVAO(this.bufferData.VBO, new Float32Array(vertArray));
    }
};

/******************* RAYS *************************/

function RayCastHandler(rayVerts) {
    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(rayVerts, this.bufferData, true);

    this.active = true;
}
RayCastHandler.prototype = {
    RewriteVerts: function(vertArray) {
        GL.RewriteVAO(this.bufferData.VBO, new Float32Array(vertArray));
    }
};



/******************* GUI ELEMENTS *************************/

function GUIBoxHandler(boxVerts) {
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(boxVerts, this.bufferData, false);

    this.shaderData = EL.assets.shaderPrograms['guiBoxTint'];
    this.tint = new Vector4(0.0, 0.0, 0.0, 1.0);
}
GUIBoxHandler.prototype = {
    SetTintRGB: function(RGBvec3) {
        this.tint.x = RGBvec3.x;
        this.tint.y = RGBvec3.y;
        this.tint.z = RGBvec3.z;
    },
    SetTintAlpha: function(a) {
        this.tint.w = a;
    },
    SetTexture: function(texture, texFilter) {
        this.bufferData.texID = GL.CreateTextureObject(texture, texFilter);
        this.shaderData = EL.assets.shaderPrograms['guiBoxTintTex'];
    }
};

function StringDisplayHandler(stringLine) {
    this.bufferData = new BufferData();

    GL.CreateBufferObjects(stringLine, this.bufferData, true);

    this.tint = new Vector4(0.0, 0.0, 0.0, 1.0);
    this.bufferData.texID = GL.CreateTextureObject(EL.assets.textures['fontMapBasic'], TextureFilters.nearest);
}
StringDisplayHandler.prototype = {
    SetTintRGB: function(RGBvec3) {
        this.tint.x = RGBvec3.x;
        this.tint.y = RGBvec3.y;
        this.tint.z = RGBvec3.z;
    },
    SetTintAlpha: function(a) {
        this.tint.w = a;
    },
    RewriteVerts: function(vertArray) {
        GL.RewriteVAO(this.bufferData.VBO, new Float32Array(vertArray));
    },
    UseBoldTexture: function() {
        GL.CreateTextureObject(EL.assets.textures['fontMapBasicBold'], TextureFilters.nearest, this.bufferData.texID);
    }
};