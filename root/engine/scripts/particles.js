/**
 * Created by Devin on 2015-01-03.
 */

function ParticlePoint() {
    this.pos = new Vector3();
    this.vel = new Vector3();
    this.acc = new Vector3();
    // Degree value for range of random velocity direction
    this.coneRange = 45.0;
    this.dampening = 0.0;
    this.lifeTime = 3.0;
    this.counter = 0.0;
    this.isAlive = true;

    this.colour = new Vector3();
    this.alpha = 1.0;
}
ParticlePoint.prototype = {
    SetFadeRate: function(endAlpha, fromTimePct) {

    },
    Update: function() {
        if(this.isAlive) {
            this.vel.SetAddScaled(this.acc, Time.deltaMilli);
            this.vel.SetScaleByNum(Math.pow(this.dampening, Time.deltaMilli));
            this.pos.SetAdd(this.vel.GetScaleByNum(Time.deltaMilli));

            this.counter += Time.deltaMilli;
            if(this.counter >= this.lifeTime)
                this.isAlive = false;
        }
    },
    Reset: function() {
        // Retain and use initial values set by user somehow
    }
};



function ParticleLine() {

}
function ParticleImage(texture) {
    this.tex = texture;
}



function ParticleSystem(trfmObj, radiusObj) {
    this.trfmObj = trfmObj;
    this.radiusObj = radiusObj;
    this.trfm = new Transform(Space.local);
    this.trfm.pos.SetCopy(this.trfmObj.pos);

    this.count = 10;
    this.sysLifeTime = 20.0;
    this.ptcls = [];
}
ParticleSystem.prototype = {
    AddParticle: function(particle) {
        this.ptcls.push(particle);
    },
    SetStartDist: function(scalar) {
        // Scaled amount from obj radius,
        // thus allowing user to say 1 for the outer sphere's edge, or zero from dead centre
        var dist = this.radiusObj * scalar;
    },
    Update: function() {

        for (var i = 0; i < this.ptcls.length; i++) {
            if(this.ptcls[i].isAlive) {
                this.ptcls[i].Update();
            }
            else {
                // ?? Easier then destroying and recreating
                // But what about the end of the systems' life? Just keep them dead (and set alpha zero) then...
                this.ptcls[i].Reset();
            }
        }
    }
};