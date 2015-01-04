
function RigidBody(trfm, modelRadius) {
    /// <signature>
    ///  <summary>Add physics motion to gameobject</summary>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="RigidBody" />
    /// </signature>
    this.trfm = trfm;
    this.modelRadius = modelRadius;

    this.active = true;
    this.velAngularDir = new Vector3();
    this.velAngularMag = new Vector3();
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
    GetNetVelocity: function(rigidBody) {
        return this.velFinal.GetSubtract(rigidBody.velFinal);
    },
    SetInertiaTensor: function(radius) {
        this.inertiaTensorInv.SetInertiaTensorSphere(this.GetMass(), radius);
        this.inertiaTensorInv.Invert();
    },
    GetRestitution: function(velPreColl, velPostColl) {
        var netPreColl = this.velInitial.GetSubtract(velPreColl);
        var netPostColl = this.velFinal.GetSubtract(velPostColl);
        return -netPostColl.SetScaleByVec(netPreColl.SetConjugate()).GetMag();
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
        //this.axisOfRotation = this.trfm.dirUp.GetCross(this.velFinal);
        //this.axisOfRotation.SetNormalized();
        //this.velAngularMag = this.velFinal.GetMag() / this.modelRadius;
        //this.velAngularDir = this.axisOfRotation.SetScaleByNum(this.velAngularMag);
        //this.trfm.SetOrientationAxisAngle(this.velAngularDir, this.velAngularMag);
        //dynObjs[i].qOrientation += (dynObjs[i].vAngularVelocity * dynObjs[i].qOrientation) * qTimeStep;

        // LINEAR UPDATE
        this.velInitial.SetCopy(this.velFinal);
        //this.trfm.TranslateVec(this.velFinal.GetScaleByNum(Time.deltaMilli));
        this.trfm.TranslateVec((this.velInitial.GetScaleByNum(Time.deltaMilli)).SetAddScaled(this.acc, 0.5 * (Time.deltaMilli * Time.deltaMilli)));

        this.acc.SetZero();
        this.acc.SetAddScaled(this.forceAccum, this.massInv);
        this.forceAccum.SetZero();

        this.velFinal.SetCopy(this.velInitial.GetAddScaled(this.acc, Time.deltaMilli));
        this.velFinal.SetScaleByNum(Math.pow(this.dampening, Time.deltaMilli));

        if(this.velFinal.GetMagSqr() < INFINITESIMAL)
            this.velFinal.SetZero();
    }
};


/*************************** MANAGE AND IMPLEMENT VARIOUS TYPES OF FORCES ****************************************/

var ForceGenerators = {
    Gravity: function(gravity)
    {
        /// <signature>
        ///  <summary>Generate force from acceleration due to gravity</summary>
        ///  <param name="gravity" type="Vector3">Gravitaional acceleration</param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {
            if (!particle.HasFiniteMass())
                return;
            particle.AddForce(gravity.GetScaleByNum(particle.GetMass()));
        }
    },
    Drag: function(k1, k2)
    {
        /// <signature>
        ///  <summary>Generate force from drag coefficients, as determined by the object and type of drag</summary>
        ///  <param name="k1" type="decimal">Linear drag coefficient</param>
        ///  <param name="k2" type="decimal">Quadratic drag coefficient</param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {
            var force = particle.velFinal.GetCopy();

            var dragCoefficient = force.GetMag();
            dragCoefficient = (k1 * dragCoefficient) + (k2 * dragCoefficient * dragCoefficient);

            force.SetNormalized();
            force.SetScaleByNum(-dragCoefficient);

            particle.AddForce(force);
        }
    },
    Spring: function(anchor, springConstant, restLength) {
        /// <signature>
        ///  <summary>
        ///    Generate a spring force between two objects.
        ///    If both objects are dynamic, both need to generate a force from each other with this function.
        ///  </summary>
        ///  <param name="anchor" type="ParticlePhysics">The object on the other end of the spring</param>
        ///  <param name="springConstant" type="decimal"></param>
        ///  <param name="restLength" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {
            var force = particle.trfm.pos.GetSubtract(anchor.trfm.pos);

            var mag = force.GetMag();
            mag -= restLength; // mag = Math.abs(magnitude - restLength); // for anchor in the middle
            mag *= springConstant;

            force.SetNormalized();
            force.SetScaleByNum(-mag);

            particle.AddForce(force);
        }
    },
    Spring_PullOnly: function(anchor, springConstant, restLength) {
        /// <signature>
        ///  <summary>
        ///    Generate a pulling spring force between two objects.
        ///    If both objects are dynamic, both need to generate a force from each other with this function.
        ///  </summary>
        ///  <param name="anchor" type="ParticlePhysics">The object on the other end of the spring</param>
        ///  <param name="springConstant" type="decimal"></param>
        ///  <param name="restLength" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {

            var force = particle.trfm.pos.GetSubtract(anchor.trfm.pos);

            var mag = force.GetMagSqr();
            if (mag <= restLength * restLength)
                return;

            mag = Math.sqrt(mag);
            mag = springConstant * (mag - restLength);

            force.SetNormalized();
            force.SetScaleByNum(-mag);

            particle.AddForce(force);
        }
    },
    Spring_PushOnly: function(anchor, springConstant, restLength) {
        /// <signature>
        ///  <summary>
        ///    Generate a pushing spring force between two objects.
        ///    If both objects are dynamic, both need to generate a force from each other with this function.
        ///  </summary>
        ///  <param name="anchor" type="ParticlePhysics">The object on the other end of the spring</param>
        ///  <param name="springConstant" type="decimal"></param>
        ///  <param name="restLength" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {
            var force = particle.trfm.pos.GetSubtract(anchor.trfm.pos);

            var mag = force.GetMagSqr();
            if (mag >= restLength * restLength)
                return;

            mag = Math.sqrt(mag);
            mag = springConstant * (mag - restLength);

            force.SetNormalized();
            force.SetScaleByNum(-mag);

            particle.AddForce(force);
        }
    },
    Spring_Stiff_Fake: function(anchorPos, springConstant, dampening) {
        /// <signature>
        ///  <summary>
        ///    Generate a fake stiff spring force between two objects.
        ///    If both objects are dynamic, both need to generate a force from each other with this function.
        ///  </summary>
        ///  <param name="anchorPos" type="Vector3">The object on the other end of the spring</param>
        ///  <param name="springConstant" type="decimal"></param>
        ///  <param name="dampening" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {
            if (!particle.HasFiniteMass())
                return;

            var pos = particle.trfm.pos.GetSubtract(anchorPos);

            var gamma = 0.5 * Math.sqrt(4 * springConstant - dampening * dampening);
            if (gamma == 0.0)
                return;

            var c = pos.GetScaleByNum(dampening / (2.0 * gamma)).SetAdd(particle.velFinal.GetScaleByNum(1.0 / gamma));
            var target = pos.GetScaleByNum(Math.cos(gamma * Time.deltaMilli)).SetAdd(c.GetScaleByNum(Math.sin(gamma * Time.deltaMilli)));
            target.SetScaleByNum(Math.exp(-0.5 * Time.deltaMilli * dampening));

            var accel = (target.GetSubtract(pos).SetScaleByNum(1.0 / Time.deltaMilli * Time.deltaMilli)).SetSubtract(particle.velFinal.GetScaleByNum(Time.deltaMilli));

            particle.AddForce(accel * particle.GetMass());
        }
    },
    Buoyancy: function(maxDepth, volume, liquidHeight, liquidDensity) {
        /// <signature>
        ///  <summary>Generate a buoancy force</summary>
        ///  <param name="maxDepth" type="decimal">The max submerge depth before the max buoancy is applied</param>
        ///  <param name="volume" type="decimal"></param>
        ///  <param name="liquidHeight" type="decimal"></param>
        ///  <param name="liquidDensity" type="decimal">1000 for water</param>
        ///  <returns type="void" />
        /// </signature>
        this.Update = function(particle) {
            var depth = particle.trfm.pos.y;

            if (depth >= liquidHeight + maxDepth)
                return;

            var force = new Vector3();

            if (depth <= liquidHeight - maxDepth) {
                force.y = liquidDensity * volume;
                particle.AddForce(force);
                return;
            }

            force.y = liquidDensity * volume * (depth - maxDepth - liquidHeight) / 2 * maxDepth;

            particle.AddForce(force);
        }
    }
};

function ForceRegistry() {
    this.registry = []

}
ForceRegistry.prototype = {
    Add: function(particle, forceGenerator) {
        this.registry.push({
            particle: particle,
            forceGenerator: forceGenerator
        });
    },
    Remove: function(particle, forceGenerator) {
    },
    Clear: function() {
        this.registry = [];
    },
    Update: function() {
        for (var i in this.registry) {
            this.registry[i].forceGenerator.Update(this.registry[i].particle);
        }
    }
};