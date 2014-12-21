
function ModelHandler(model, shapeData) {
    // Decide whether to draw with Elements or not
    this.vertData = ModelUtils.SelectVAOData(model.vertices);
    this.shapeData = shapeData;

    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(this.vertData, this.bufferData, false);
    // Get the appropriate shader for the model given
    this.shaderData = ModelUtils.AssignShaderProgram(this.vertData, model.materials);

    // Get draw method.
    if(model.hasOwnProperty('drawMethod'))
        this.drawMethod = GL.GetDrawMethod(model.drawMethod);
    else
        this.drawMethod = GL.GetDrawMethod(DrawMethods.triangles);

    this.active = true;
    this.mtxModel = new Matrix4();
    this.colourTint = new Vector3();

    // This is specifically set this way for frustum culling. No need to be more dynamic
    this.drawSphere = new Sphere(shapeData.centre, shapeData.radius);

    // Hold just indices for now, so as to rewrite if necessary, to create wire frames
    this.indices = model.vertices.byMesh.indices;
}
ModelHandler.prototype = {
    SetTexture: function(texture) {
        this.bufferData.texID = GL.CreateTextureObject(texture);
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
    UpdateModelViewControl: function(trfm) {
        //this.mtxModel.SetOrientation(trfm.pos, trfm.dirFwd, trfm.dirUp, Space.local);
        this.mtxModel.SetIdentity();
        this.mtxModel.SetTranslateVec3(trfm.pos);
        this.mtxModel.SetRotateAbout(trfm.orient.GetAxis(), trfm.orient.GetAngle());
        this.mtxModel.SetScaleVec3(trfm.scale);

        // Keep bounding sphere updated for accurate frustum culling
        this.drawSphere.pos.SetCopy(trfm.pos);
        this.drawSphere.radius = this.shapeData.radius * trfm.GetLargestScaleValue();
    }
};