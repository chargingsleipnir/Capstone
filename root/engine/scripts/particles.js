/**
 * Created by Devin on 2015-01-03.
 */

function ParticleSimple(travelTime, countDown) {
    // Physics
    this.startPos = new Vector3();
    this.startVel = new Vector3();
    this.startAcc = new Vector3();
    this.pos = new Vector3(0.0, 999.0, 0.0);
    this.vel = new Vector3();
    this.acc = new Vector3();
    this.dampening = 1.0;
    // Duration
    this.travelTime = travelTime;
    this.countDown = countDown;
    this.isAlive = false;
    // Effects
    this.tailPos = this.pos.GetCopy();
    this.tailLength = 0.0;
}
ParticleSimple.prototype = {
    Update: function() {
        if(this.isAlive) {
            this.vel.SetAddScaled(this.acc, Time.deltaMilli);
            this.vel.SetScaleByNum(Math.pow(this.dampening, Time.deltaMilli));
            this.pos.SetAdd(this.vel.GetScaleByNum(Time.deltaMilli));

            if(this.tailLength > 0) {
                var dir = this.vel.GetNormalized();
                this.tailPos = this.pos.GetSubtract(dir.SetScaleByNum(this.tailLength));
            }

            this.countDown -= Time.deltaMilli;
            if(this.countDown < 0.0)
                this.Reset();
        }
    },
    Reset: function() {
        this.pos.SetCopy(this.startPos);
        this.vel.SetCopy(this.startVel);
        this.acc.SetCopy(this.startAcc);
        this.tailPos.SetCopy(this.startPos);
        this.countDown = this.travelTime;
    }
};

function ParticleFieldSimple(ptclCount, fieldLife, effects) {
    this.ptclCount = ptclCount || 10;
    this.fieldLifeTime = fieldLife || 20.0;
    this.counter = this.fieldLifeTime;

    // Timing of this field. Using a field shutdown that allows every active particle to finish out it's own lifespan.
    this.active = false;
    this.deadPtcls = this.ptclCount;
    this.stagger = effects.staggerRate;

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
    var dir = effects.dir.GetNormalized();
    for(var i = 0; i < this.ptclCount; i++) {
        var randX = Math.random(),
            randY = Math.random(),
            randZ = Math.random();
        this.ptcls.push(new ParticleSimple(effects.travelTime, effects.staggerRate * i ));

        var randConeAngle = (effects.range / 2.0) * ((randX*2) - 1);
        var randRotAngle = 360 * randY;
        var randDir = dir.GetRotated(randConeAngle, dir.GetOrthoAxis());
        randDir.SetRotated(randRotAngle, dir);

        this.ptcls[i].startPos.SetCopy(randDir.GetScaleByNum(effects.startDist));
        this.ptcls[i].startVel.SetCopy(randDir.GetScaleByNum(effects.speed));
        this.ptcls[i].startAcc.SetCopy(effects.acc);
        this.ptcls[i].dampening = effects.dampening;

        var ptclColour = [
            (effects.colourTop.x - effects.colourBtm.x) * randX + effects.colourBtm.x,
            (effects.colourTop.y - effects.colourBtm.y) * randY + effects.colourBtm.y,
            (effects.colourTop.z - effects.colourBtm.z) * randZ + effects.colourBtm.z
        ];

        ptclVerts.posCoords = ptclVerts.posCoords.concat(this.ptcls[i].pos.GetData());
        ptclVerts.colElems = ptclVerts.colElems.concat(ptclColour);

        if(effects.lineLength > 0) {
            this.ptcls[i].tailLength = effects.lineLength;
            ptclVerts.posCoords = ptclVerts.posCoords.concat(this.ptcls[i].tailPos.GetData());
            ptclVerts.colElems = ptclVerts.colElems.concat(ptclColour);
        }
    }

    if(effects.lineLength <= 0)
        this.fieldHdlr = new PtclFieldHandler(ptclVerts, DrawMethods.points);
    else
        this.fieldHdlr = new PtclFieldHandler(ptclVerts, DrawMethods.lines);
}
ParticleFieldSimple.prototype = {
    DefinePtclFade: function(endAlpha, fromTime) {

    },
    CheckEnd: function() {
        this.counter -= Time.deltaMilli;
        if(this.counter <= 0)
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
                if(this.ptcls[i].tailLength > 0)
                    newPosCoords = newPosCoords.concat(this.ptcls[i].tailPos.GetData());
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
            if(this.ptcls[i].tailLength > 0)
                newPosCoords = newPosCoords.concat(this.ptcls[i].tailPos.GetData());
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
                        this.ptcls[i].tailPos.SetValues(0.0, 999.0, 0.0);
                        this.deadPtcls++;
                    }
                }
                newPosCoords = newPosCoords.concat(this.ptcls[i].pos.GetData());
                if(this.ptcls[i].tailLength > 0)
                    newPosCoords = newPosCoords.concat(this.ptcls[i].tailPos.GetData());
            }
            this.fieldHdlr.RewriteVerts(newPosCoords);
        }
        else {
            // Reset things
            this.Callback = this.Launch;
            this.counter = this.fieldLifeTime;
            for (var i = 0; i < this.ptcls.length; i++) {
                this.ptcls[i].countDown = this.stagger * i;
            }
            this.active = false;
        }
    }
};

function ParticleTrail(trfmObj, ptclCount, fieldLife, colour) {
    this.trfm = trfmObj;
    this.ptclCount = ptclCount || 10;
    this.fieldLifeTime = fieldLife || 20.0;
    this.counter = this.fieldLifeTime;

    // Height effect - much can be done with this. Add a twist?
    this.radialHeight = 0.25;

    // Timing of this field. Using a field shutdown that allows every active particle to finish out it's own lifespan.
    this.active = false;

    // Using changing looping functions
    this.Callback = this.Launch;

    this.posCoords = [];
    var colElems = [];
    for(var i = 0; i < this.ptclCount; i++) {
        this.posCoords.push(this.trfm.pos.x);
        this.posCoords.push(this.trfm.pos.y + this.radialHeight);
        this.posCoords.push(this.trfm.pos.z);
        this.radialHeight = -this.radialHeight;

        colElems = colElems.concat(colour.GetData());
    }

    var ptclVerts = {
        count: this.ptclCount,
        posCoords: this.posCoords,
        colElems: colElems,
        texCoords: [],
        normAxes: []
    };

    this.trailHdlr = new RayCastHandler(ptclVerts);
}
ParticleTrail.prototype = {
    CheckEnd: function() {
        this.counter -= Time.deltaMilli;
        if(this.counter <= 0)
            this.Callback = this.Terminate;
    },
    Launch: function() {
        this.posCoords = [];
        for(var i = 0; i < this.ptclCount; i++) {
            this.posCoords.push(this.trfm.pos.x);
            this.posCoords.push(this.trfm.pos.y + this.radialHeight);
            this.posCoords.push(this.trfm.pos.z);
            this.radialHeight = -this.radialHeight;
        }
        this.trailHdlr.RewriteVerts(this.posCoords);

        this.Callback = this.Update;
    },
    Update: function() {
        /* This loop function is implemented to allow each particle field to slowly stagger
         * in, update, and stagger out all of it's particles, so they don't all have to arrive
         * or disappear at the same time. */
        this.posCoords.pop();
        this.posCoords.pop();
        this.posCoords.pop();
        this.posCoords.unshift(this.trfm.pos.x, this.trfm.pos.y + this.radialHeight, this.trfm.pos.z);
        this.trailHdlr.RewriteVerts(this.posCoords);
        this.radialHeight = -this.radialHeight;
        this.CheckEnd();
    },
    Terminate: function() {
        this.posCoords = [];
        for(var i = 0; i < this.ptclCount; i++) {
            this.posCoords.push(this.trfm.pos.x);
            this.posCoords.push(999.0);
            this.posCoords.push(this.trfm.pos.z);
        }
        this.trailHdlr.RewriteVerts(this.posCoords);

        this.Callback = this.Launch;
        this.counter = this.fieldLifeTime;
        this.active = false;
    }
};


function ParticleSystem(trfmObj) {
    this.trfmObj = trfmObj;
    this.mtxModel = trfmObj.mtx;

    this.simpleFields = [];
    this.trails = [];
}
ParticleSystem.prototype = {
    AddSimpleField: function(ptclCount, fieldLife, effects) {
        this.simpleFields.push(new ParticleFieldSimple(ptclCount, fieldLife, effects));
    },
    AddTrail: function(ptclCount, fieldLife, colour) {
        this.trails.push(new ParticleTrail(this.trfmObj, ptclCount, fieldLife, colour));
    },
    RemoveField: function(field) {
        var index = this.simpleFields.indexOf(field);
        if(index != -1) {
            this.simpleFields.splice(index, 1);
        }
    },
    RunField: function(index) {
        this.simpleFields[index].active = true;
    },
    Runtrail: function(index) {
        this.trails[index].active = true;
    },
    GetSimpleFields: function() {
        return this.simpleFields;
    },
    GetTrails: function() {
        return this.trails;
    },
    Update: function() {
        for (var i = this.simpleFields.length - 1; i >= 0; i--) {
            if(this.simpleFields[i].active) {
                this.simpleFields[i].Callback();
            }
        }
        for (var i = this.trails.length - 1; i >= 0; i--) {
            if (this.trails[i].active) {
                this.trails[i].Callback();
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
