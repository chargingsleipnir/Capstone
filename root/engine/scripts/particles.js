/**
 * Created by Devin on 2015-01-03.
 */

function ParticlePoint(travelTime, countDown) {
    // Physics
    this.startPos = new Vector3();
    this.startVel = new Vector3();
    this.startAcc = new Vector3();
    this.pos = new Vector3(0.0, 999.0, 0.0);
    this.vel = new Vector3();
    this.acc = new Vector3();
    this.coneRange = 45.0;
    this.dampening = 1.0;
    // Duration
    this.travelTime = travelTime;
    this.countDown = countDown;
    this.isAlive = false;
    // Effects
    this.colour = new Vector3();
    this.alpha = 1.0;
}
ParticlePoint.prototype = {
    Update: function() {
        if(this.isAlive) {
            this.vel.SetAddScaled(this.acc, Time.deltaMilli);
            this.vel.SetScaleByNum(Math.pow(this.dampening, Time.deltaMilli));
            this.pos.SetAdd(this.vel.GetScaleByNum(Time.deltaMilli));

            this.countDown -= Time.deltaMilli;
            if(this.countDown < 0.0)
                this.Reset();
        }
    },
    Reset: function() {
        this.pos.SetCopy(this.startPos);
        this.vel.SetCopy(this.startVel);
        this.acc.SetCopy(this.startAcc);
        this.countDown = this.travelTime;
    }
};

function ParticlePointField(ptclCount, fieldLife, effects) {
    this.ptclCount = ptclCount || 10;
    this.fieldLifeTime = fieldLife || 20.0;

    this.effects = new PtclEffects(effects);

    // Timing of this field. Using a field shutdown that allows every active particle to finish out it's own lifespan.
    this.active = true;
    this.deadPtcls = this.ptclCount;

    // Using changing looping functions
    this.Callback = this.Launch;

    // Containers for drawing
    this.ptcls = [];
    var ptclVerts = {
        count: this.ptclCount,
        posCoords: [],
        colElems: [],
        texCoords: [],
        normAxes: []
    };

    // Instantiate particles
    this.effects.dir.SetNormalized();
    for(var i = 0; i < this.ptclCount; i++) {
        var randX = Math.random(),
            randY = Math.random(),
            randZ = Math.random();
        this.ptcls.push(new ParticlePoint(this.effects.travelTime, effects.staggerRate * i ));

        var randConeAngle = (effects.range / 2.0) * ((randX*2) - 1);
        var randRotAngle = 360 * randY;
        var randDir = this.effects.dir.GetRotated(randConeAngle, this.effects.dir.GetOrthoAxis());
        randDir.SetRotated(randRotAngle, this.effects.dir);

        this.ptcls[i].startPos.SetCopy(randDir.GetScaleByNum(this.effects.startDist));
        this.ptcls[i].startVel.SetCopy(randDir.GetScaleByNum(this.effects.speed));
        this.ptcls[i].startAcc.SetCopy(this.effects.acc);
        this.ptcls[i].dampening = this.effects.dampening;

        ptclVerts.posCoords = ptclVerts.posCoords.concat(this.ptcls[i].pos.GetData());
        ptclVerts.colElems = ptclVerts.colElems.concat([
            (this.effects.colourTop.x - this.effects.colourBtm.x) * randX + this.effects.colourBtm.x,
            (this.effects.colourTop.y - this.effects.colourBtm.y) * randY + this.effects.colourBtm.y,
            (this.effects.colourTop.z - this.effects.colourBtm.z) * randZ + this.effects.colourBtm.z
        ]);
    }

    this.fieldHdlr = new PtclFieldHandler(ptclVerts, DrawMethods.points);
}
ParticlePointField.prototype = {
    DefinePtclFade: function(endAlpha, fromTime) {

    },
    CheckEnd: function() {
        this.fieldLifeTime -= Time.deltaMilli;
        if(this.fieldLifeTime <= 0)
            this.Callback = this.Terminate;
    },
    Launch: function() {
        /* This loop function is implemented to allow each particle field to slowly stagger
         * in, update, and stagger out all of it's particles, so they don't all have to arrive
         * or disappear at the same time. */
        var newPosCoords = [];

        if(this.deadPtcls > 0) {
            for (var i = 0; i < this.ptcls.length; i++) {
                // This will stagger them out accordingly,
                // as pre-set in constructor
                if(this.ptcls[i].isAlive == false) {
                    this.ptcls[i].countDown -= Time.deltaMilli;
                    if(this.ptcls[i].countDown <= 0) {
                        this.ptcls[i].isAlive = true;
                        this.deadPtcls--;
                        this.ptcls[i].Reset();
                    }
                }
                else {
                    this.ptcls[i].Update();
                }
                newPosCoords = newPosCoords.concat(this.ptcls[i].pos.GetData());
            }
            this.fieldHdlr.RewriteVerts(newPosCoords);
        }
        else {
            this.Callback = this.Update;
        }
        this.CheckEnd();
    },
    Update: function() {
        /* This loop function is implemented to allow each particle field to slowly stagger
         * in, update, and stagger out all of it's particles, so they don't all have to arrive
         * or disappear at the same time. */
        var newPosCoords = [];
        for (var i = 0; i < this.ptcls.length; i++) {
            this.ptcls[i].Update();
            newPosCoords = newPosCoords.concat(this.ptcls[i].pos.GetData());
        }
        this.fieldHdlr.RewriteVerts(newPosCoords);
        this.CheckEnd();
    },
    Terminate: function() {
        /* This loop function is implemented to allow each particle field to slowly stagger
         * in, update, and stagger out all of it's particles, so they don't all have to arrive
         * or disappear at the same time. */
        var newPosCoords = [];

        if(this.deadPtcls < this.ptcls.length) {
            for (var i = 0; i < this.ptcls.length; i++) {
                if(this.ptcls[i].isAlive) {
                    this.ptcls[i].Update();
                    // This condition is met on during each particle's reset.
                    if (this.ptcls[i].countDown >= this.ptcls[i].travelTime - Time.deltaMilli) {
                        this.ptcls[i].isAlive = false;
                        this.ptcls[i].pos.SetValues(0.0, 999.0, 0.0);
                        this.deadPtcls++;
                    }
                }
                newPosCoords = newPosCoords.concat(this.ptcls[i].pos.GetData());
            }
            this.fieldHdlr.RewriteVerts(newPosCoords);
        }
        else
            return -1;
    }
};


function ParticleSystem(trfmObjMtx) {
    //this.trfmObj = trfmObj;
    this.mtxModel = trfmObjMtx;

    this.runningFields = [];
    this.ptclFields = {};
}
ParticleSystem.prototype = {
    AddField: function(field, name) {
        this.ptclFields[name] = field;
    },
    RemoveField: function(name) {
        var index = this.ptclFields.indexOf(this.ptclFields[name]);
        if(index != -1) {
            this.runningFields.splice(index, 1);
            delete this.ptclFields[name];
        }
    },
    RunField: function(name) {
        this.runningFields.push(this.ptclFields[name]);
    },
    GetRunningPtclFields: function() {
        return this.runningFields;
    },
    Update: function() {
        for (var i = this.runningFields.length - 1; i >= 0; i--) {
            if(this.runningFields[i].Callback() == -1) {
                this.runningFields.splice(i, 1);
            }
        }
    }
};













function ParticleLineField(trfmObj, radiusObj) {
    this.trfmObj = trfmObj;
    this.radiusObj = radiusObj;
    this.trfm = new Transform(Space.local);
    this.trfm.pos.SetCopy(this.trfmObj.pos);

    this.count = 10;
    this.sysLifeTime = 20.0;
    this.ptcls = [];
}
ParticleLineField.prototype = {
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


function ParticleShapeField(trfmObj, radiusObj) {
    this.trfmObj = trfmObj;
    this.radiusObj = radiusObj;
    this.trfm = new Transform(Space.local);
    this.trfm.pos.SetCopy(this.trfmObj.pos);

    this.count = 10;
    this.sysLifeTime = 20.0;
    this.ptcls = [];
}
ParticleShapeField.prototype = {
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
