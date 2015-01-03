
function ModelHandler(model, shapeData) {
    // Decide whether to draw with Elements or not
    this.vertData = ModelUtils.SelectVAOData(model.vertices);
    this.shapeData = shapeData;

    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(this.vertData, this.bufferData, false);

    this.shaderData = ModelUtils.BuildShaderProgram(this.vertData, model.materials, true);

    if(model.materials[0]) {
        this.mat = model.materials[0];
        //this.tint = new Vector4(0.0, 0.0, 0.0, model.materials[0].alpha);
    }
    else {
        //this.tint = new Vector4();
    }
    this.tint = new Vector3();

    // Get draw method.
    if(model.hasOwnProperty('drawMethod'))
        this.drawMethod = GL.GetDrawMethod(model.drawMethod);
    else
        this.drawMethod = GL.GetDrawMethod(DrawMethods.triangles);

    this.active = true;
    this.mtxModel = new Matrix4();

    // This is specifically set this way for frustum culling. No need to be more dynamic
    this.drawSphere = new Sphere(shapeData.centre, shapeData.radius);

    // Hold just indices for now, so as to rewrite if necessary, to create wire frames
    this.indices = model.vertices.byMesh.indices;
}
ModelHandler.prototype = {
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
    },
    UpdateModelViewControl: function(trfm) {
        //this.mtxModel.SetOrientation(trfm.pos, trfm.dirFwd, trfm.dirUp, trfm.dirRight, Space.local);

        this.mtxModel.SetIdentity();
        this.mtxModel.SetTranslateVec3(trfm.pos);
        this.mtxModel.SetRotateAbout(trfm.orient.GetAxis(), trfm.orient.GetAngle());
        this.mtxModel.SetScaleVec3(trfm.scale);

        // Keep bounding sphere updated for accurate frustum culling
        this.drawSphere.pos.SetCopy(trfm.pos);
        this.drawSphere.radius = this.shapeData.radius * trfm.GetLargestScaleValue();
    }
};

function RayCastHandler(rayVerts) {
    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(rayVerts, this.bufferData, true);

    this.active = true;
    this.tint = new Vector3();
}
RayCastHandler.prototype = {
    RewriteVerts: function(vertArray) {
        GL.RewriteVAO(this.bufferData.VBO, new Float32Array(vertArray));
    }
};


function GUIBoxHandler(boxVerts) {
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(boxVerts, this.bufferData, false);

    this.shaderData = EL.assets.shaderPrograms['guiBoxTint'];
    this.tint = new Vector3();
    this.alpha = 1.0;
}
GUIBoxHandler.prototype = {
    SetTexture: function(texture, texFilter) {
        this.bufferData.texID = GL.CreateTextureObject(texture, texFilter);
        this.shaderData = EL.assets.shaderPrograms['guiBoxTintTex'];
    }
};

function StringDisplayHandler(stringLine) {
    this.bufferData = new BufferData();

    GL.CreateBufferObjects(stringLine, this.bufferData, true);

    this.tint = new Vector3();
    this.bufferData.texID = GL.CreateTextureObject(EL.assets.textures['fontMapBasic'], TextureFilters.nearest);
}
StringDisplayHandler.prototype = {
    RewriteVerts: function(vertArray) {
        GL.RewriteVAO(this.bufferData.VBO, new Float32Array(vertArray));
    },
    UseBoldTexture: function() {
        GL.CreateTextureObject(EL.assets.textures['fontMapBasicBold'], TextureFilters.nearest, this.bufferData.texID);
    }
};