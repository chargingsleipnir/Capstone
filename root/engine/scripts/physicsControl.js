
function PhysicsBody(trfm) {
    /// <signature>
    ///  <summary>Add physics motion to gameobject</summary>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="PhysicsBody" />
    /// </signature>
    this.trfm = trfm;

    this.active = true;
    this.velAngular = new Vector3();
    this.velInitial = new Vector3();
    this.velFinal = new Vector3();
    this.acc = new Vector3();
    this.torque = new Vector3();
    this.forceAccum = new Vector3();
    this.massInv = 0.0;
    this.dampening = 1.0;

    this.axisOfRotation = new Vector3();
    this.inertiaTensorInv = new Matrix3();
    this.radiusToPt = new Vector3();
}
PhysicsBody.prototype = {
    SetMass: function(mass) {
        if (mass > INFINITESIMAL)
            this.massInv = 1.0 / mass;
    },
    /**
     * @return {number}
     */
    GetMass: function() {
        return 1.0 / this.massInv;
    },
    /**
     * @return {boolean}
     */
    HasFiniteMass: function() {
        return this.massInv > INFINITESIMAL;
    },
    AddForce: function(force) {
        this.forceAccum.SetAdd(force);
    },
    SetInertiaTensor: function(radius) {
        this.inertiaTensorInv.SetInertiaTensorSphere(this.GetMass(), radius);
        this.inertiaTensorInv.Invert();
    },
    Update: function() {
        this.acc.SetAddScaled(this.forceAccum, this.massInv);
        this.velFinal.SetCopy(this.velInitial.GetAddScaled(this.acc, Time.delta_Milli));
        this.velFinal.SetScaleByNum(Math.pow(this.dampening, Time.delta_Milli));

        // Collision detection needs to happen in here? To adjust final velocity...
        // Maybe this is where the force accum can come into play

        this.velInitial.SetCopy(this.velFinal);
        this.trfm.TranslateVec3((this.velInitial.GetScaleByNum(Time.delta_Milli)).SetAddScaled(this.acc, 0.5 * (Time.delta_Milli * Time.delta_Milli)));
    }
};