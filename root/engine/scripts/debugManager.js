
var DM = {
    shapes: []
};

function DebugDrawHandler(model) {
    // Decide whether to draw with Elements or not
    this.vertData = ModelUtils.SelectVAOData(model.vertices);
    // Create Buffer
    this.bufferData = new BufferData();
    GL.CreateBufferObjects(this.vertData, this.bufferData, false);

    // Get draw method.
    if(model.hasOwnProperty('drawMethod'))
        this.drawMethod = GL.GetDrawMethod(model.drawMethod);
    else
        this.drawMethod = GL.GetDrawMethod(DrawMethods.lines);

    this.active = true;
    this.mtxModel = new Matrix4();
}
DebugDrawHandler.prototype = {
    UpdateModelViewControl: function (trfm) {
        //this.mtxModel.SetOrientation(trfm.pos, trfm.dirFwd, trfm.dirUp, Space.local);
        this.mtxModel.SetIdentity();
        this.mtxModel.SetTranslateVec3(trfm.pos);
        this.mtxModel.SetRotateAbout(trfm.orient.GetAxis(), trfm.orient.GetAngle());
        this.mtxModel.SetScaleVec3(trfm.scale);
    }
};