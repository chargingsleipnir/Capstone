
function PhysicsBody(trfm) {
    /// <signature>
    ///  <summary>Add physics motion to gameobject</summary>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="PhysicsBody" />
    /// </signature>
    this.active = true;
    this.velAngular = new Vector3();
    this.velInitial = new Vector3();
    this.velFinal = new Vector3();
    this.acc = new Vector3();
    this.torque = new Vector3();

    this.mass = 0.0;

    this.axisOfRotation = new Vector3();
    this.inertiaTensorInv = new Matrix3();
    this.radiusToPt = new Vector3();

    this.Update = function() {
        this.velInitial.SetCopy(this.velFinal);
        trfm.TranslateVec3((this.velInitial.GetScaleByNum(Time.delta_Milli)).SetAddScaled(this.acc, 0.5 * (Time.delta_Milli * Time.delta_Milli)));
    }
}
PhysicsBody.prototype = {
    SetInertiaTensor: function(radius) {
        this.inertiaTensorInv.SetInertiaTensorSphere(this.mass, radius);
        this.inertiaTensorInv.Invert();
    }
};