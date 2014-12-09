
function ModelHandler(model) {
    // Get the appropriate shader for the model given
    this.shaderData = Utility.AssignShaderProgram(model);
    // Create Buffer
    this.bufferData = GL.CreateBufferObjects(model, this.shaderData);
    // Get draw method.
    if(model.hasOwnProperty('drawMethod'))
        this.drawMethod = GL.GetDrawMethod(model.drawMethod);
    else
        this.drawMethod = GL.GetDrawMethod(DrawMethods.triangles);

    //this.materials = model.materials;
    //console.log(model.materials);

    this.active = true;
    this.mtxModel = new Matrix4();
    this.colourTint = new Vector3();

    // This is specifically set this way for frustum culling. No need to be more dynamic
    this.drawSphere = GeomUtils.GetFromVertCoords(model.vertices.byMesh.posCoords, new Sphere());

    // Add controller to draw call;
    GM.models.push(this);
}
ModelHandler.prototype = {
    SetTexture: function(texture) {
        this.bufferData.texID = GL.CreateTextureObject(texture);
    },
    UpdateModelViewControl: function(trfm) {
        //this.mtxModel.SetOrientation(trfm.pos, trfm.dirFwd, trfm.dirUp, Space.local);
        this.mtxModel.SetIdentity();
        this.mtxModel.SetTranslateVec3(trfm.pos);
        this.mtxModel.SetRotateAbout(trfm.orient.GetAxis(), trfm.orient.GetAngle());
        this.mtxModel.SetScaleVec3(trfm.scale);

        // Keep bounding sphere updated for accurate frustum culling
        this.drawSphere.pos.SetCopy(trfm.pos);
        this.drawSphere.scale = trfm.GetLargestScaleValue();
    }
}