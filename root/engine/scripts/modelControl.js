
function ModelHandler(model, shapeData) {
    // Get the appropriate shader for the model given
    this.shaderData = Utility.AssignShaderProgram(model);
    // Create Buffer
    this.bufferData = GL.CreateBufferObjects(model, this.shaderData);
    // Get draw method.
    if(model.hasOwnProperty('drawMethod'))
        this.drawMethod = GL.GetDrawMethod(model.drawMethod);
    else
        this.drawMethod = GL.GetDrawMethod(DrawMethods.triangles);

    this.active = true;
    this.mtxModel = new Matrix4();
    this.colourTint = new Vector3();

    // This is specifically set this way for frustum culling. No need to be more dynamic
    this.shapeData = shapeData;
    this.drawSphere = new Sphere(shapeData.centre, shapeData.radius);

    // Hold just indices for now, so as to rewrite if necessary, to create wire frames
    this.indices = model.vertices.byFaces.indices;

    // Add controller to draw call;
    GM.models.push(this);
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