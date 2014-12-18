
function RigidBody(trfm, modelRadius) {
    /// <signature>
    ///  <summary>Add physics motion to gameobject</summary>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="RigidBody" />
    /// </signature>
    this.trfm = trfm;
    this.modelRadius = modelRadius;

    this.active = true;
    this.velAngular = new Vector3();
    this.velInitial = new Vector3();
    this.velFinal = new Vector3();
    this.acc = new Vector3();
    this.torque = new Vector3();
    this.forceAccum = new Vector3();
    this.impulseAccum = 0.0;
    this.massInv = 0.0;
    this.dampening = 1.0;
    this.impulse = 0.0;

    this.axisOfRotation = new Vector3();
    this.inertiaTensorInv = new Matrix3();
    this.radiusToPt = new Vector3();
}
RigidBody.prototype = {
    SetMass: function(mass) {
        if (mass > INFINITESIMAL)
            this.massInv = 1.0 / mass;
    },
    GetMass: function() {
        return 1.0 / this.massInv;
    },
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
    GetNetVelocity: function(rigidBody) {
        return this.velFinal.GetSubtract(rigidBody.velFinal);
    },
    CalculateImpulse: function(rigidBody, collisionDist, coefOfRest) {
        collisionDist.SetNormalized();
        var relative = collisionDist.GetDot(this.velInitial.GetSubtract(rigidBody.velInitial));
        // Calculate impulse
        var numerator = -relative * (coefOfRest + 1.0);
        var denomObj0 = collisionDist.GetDot((this.inertiaTensorInv.MultiplyVec3(this.radiusToPt.GetCross(collisionDist))).GetCross(this.radiusToPt));
        var denomObj1 = collisionDist.GetDot((rigidBody.inertiaTensorInv.MultiplyVec3(rigidBody.radiusToPt.GetCross(collisionDist))).GetCross(rigidBody.radiusToPt));
        var denominator = this.massInv + rigidBody.massInv + denomObj0 + denomObj1;
        var impulse = numerator / denominator;
        // Apply impulse
        //this.AddForce(collisionDist.GetScaleByNum(impulse));
        //rigidBody.AddForce(collisionDist.GetScaleByNum(-impulse));

        this.velFinal.SetCopy(this.velInitial.GetAddScaled(collisionDist, impulse * this.massInv));
        rigidBody.velFinal.SetCopy(rigidBody.velInitial.GetAddScaled(collisionDist, -impulse * rigidBody.massInv));
    },
    Update: function() {
        // ROTATIONAL UPDATE
        /*
        this.axisOfRotation = this.trfm.dirUp.GetCross(this.velFinal);
        this.axisOfRotation.SetNormalized();
        var mag = this.velFinal.GetMag() / this.modelRadius;
        this.velAngular = this.axisOfRotation.SetScaleByNum(mag);
        */
        this.velInitial.SetCopy(this.velFinal);
        this.trfm.TranslateVec3((this.velInitial.GetScaleByNum(Time.delta_Milli)).SetAddScaled(this.acc, 0.5 * (Time.delta_Milli * Time.delta_Milli)));

        // LINEAR UPDATE
        this.acc.SetAddScaled(this.forceAccum, this.massInv);
        this.velFinal.SetCopy(this.velInitial.GetAddScaled(this.acc, Time.delta_Milli));
        this.velFinal.SetScaleByNum(Math.pow(this.dampening, Time.delta_Milli));

        if(this.velFinal.GetMagSqr() < INFINITESIMAL)
            this.velFinal.SetZero();

        this.forceAccum.SetZero();
    }
};