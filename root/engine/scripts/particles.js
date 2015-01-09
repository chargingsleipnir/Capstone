/**
 * Created by Devin on 2015-01-03.
 */

/******************************** Point and line Particles *****************************************/

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


/******************************** Texture Particles *****************************************/

function ParticleTextured(travelTime, countDown, radius) {
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

    this.trfm = new Transform(Space.global);
    this.ptclHdlr = new ModelHandler(new Primitives.Rect(new Vector2(radius, radius)), this.trfm);
}
ParticleTextured.prototype = {
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
        this.tailPos.SetCopy(this.startPos);
        this.countDown = this.travelTime;
    }
};

function ParticleFieldTextures(trfmObj, ptclCount, fieldLife, effects) {
    this.ptclCount = ptclCount || 10;
    this.fieldLifeTime = fieldLife || 20.0;
    this.counter = this.fieldLifeTime;

    // Timing of this field. Using a field shutdown that allows every active particle to finish out it's own lifespan.
    this.active = false;
    this.deadPtcls = this.ptclCount;
    this.stagger = effects.staggerRate;

    /*
    this.alphaStart = 1.0;
    this.alphaEnd = 1.0;
    this.texture = EL.assets.textures['star'];
    this.rotAngDeg = 15.0;
    */

    /* I think they'll all need a transform of their own to do everything wanted with them.
     * They'll need the same kind of gameobject parent trfm calculations to maintain their relativeity.
     */

    // Do something to check for "shape" in handler, because there's no point in sending one, as it would be super wasteful to
    // dp frustum culling of these tiny 6-vertex particles.

    // Using changing looping functions
    this.Callback = this.Launch;

    this.ptcls = [];

    // Instantiate particles
    var dir = effects.dir.GetNormalized();
    for(var i = 0; i < this.ptclCount; i++) {
        var randX = Math.random(),
            randY = Math.random(),
            randZ = Math.random();
        this.ptcls.push(new ParticleTextured(effects.travelTime, effects.staggerRate * i, effects.size/2 ));

        var randConeAngle = (effects.range / 2.0) * ((randX*2) - 1);
        var randRotAngle = 360 * randY;
        var randDir = dir.GetRotated(randConeAngle, dir.GetOrthoAxis());
        randDir.SetRotated(randRotAngle, dir);

        this.ptcls[i].startPos.SetCopy(randDir.GetScaleByNum(effects.startDist));
        this.ptcls[i].startVel.SetCopy(randDir.GetScaleByNum(effects.speed));
        this.ptcls[i].startAcc.SetCopy(effects.acc);
        this.ptcls[i].dampening = effects.dampening;
    }
}
ParticleFieldTextures.prototype = {
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


/******************************** Particle Tail *****************************************/

function FlatTail(trfmObj, ptclCount, fieldLife, effects) {
    this.trfm = trfmObj;
    this.ptclCount = ptclCount || 10;
    this.fieldLifeTime = fieldLife || 20.0;
    this.counter = this.fieldLifeTime;

    /*
    tailEffects.axis = Axes.x;
    */
    this.axis = new Vector3();
    if(effects.axis == Axes.x)
        this.axis.x = effects.thickness / 2;
    else if(effects.axis == Axes.y)
        this.axis.y = effects.thickness / 2;
    else if(effects.axis == Axes.z)
        this.axis.z = effects.thickness / 2;

    // Timing of this field. Using a field shutdown that allows every active particle to finish out it's own lifespan.
    this.active = false;

    // Using changing looping functions
    this.Callback = this.Launch;

    this.posCoords = [];
    var colElems = [];
    for(var i = 0; i < this.ptclCount; i++) {
        this.posCoords.push(this.trfm.pos.x + this.axis.x);
        this.posCoords.push(this.trfm.pos.y + this.axis.y);
        this.posCoords.push(this.trfm.pos.z + this.axis.z);
        this.axis.SetNegative();

        colElems = colElems.concat(effects.colour.GetData());
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
FlatTail.prototype = {
    CheckEnd: function() {
        this.counter -= Time.deltaMilli;
        if(this.counter <= 0)
            this.Callback = this.Terminate;
    },
    Launch: function() {
        this.posCoords = [];
        for(var i = 0; i < this.ptclCount; i++) {
            this.posCoords.push(this.trfm.pos.x + this.axis.x);
            this.posCoords.push(this.trfm.pos.y + this.axis.y);
            this.posCoords.push(this.trfm.pos.z + this.axis.z);
            this.axis.SetNegative();
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
        this.posCoords.unshift(
            this.trfm.pos.x + this.axis.x,
            this.trfm.pos.y + this.axis.y,
            this.trfm.pos.z + this.axis.z
        );
        this.axis.SetNegative();
        this.trailHdlr.RewriteVerts(this.posCoords);
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


/******************************** Particle Management *****************************************/

function ParticleSystem(trfmObj) {
    this.trfmObj = trfmObj;

    this.simpleFields = [];
    this.tails = [];
    this.texFields = [];
}
ParticleSystem.prototype = {
    AddSimpleField: function(ptclCount, fieldLife, effects) {
        this.simpleFields.push(new ParticleFieldSimple(ptclCount, fieldLife, effects));
    },
    AddTail: function(ptclCount, fieldLife, effects) {
        this.tails.push(new FlatTail(this.trfmObj, ptclCount, fieldLife, effects));
    },
    AddTexField: function(ptclCount, fieldLife, effects) {
        this.texFields.push(new ParticleFieldTextures(this.trfmObj, ptclCount, fieldLife, effects));
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
    RunTail: function(index) {
        this.tails[index].active = true;
    },
    GetSimpleFields: function() {
        return this.simpleFields;
    },
    GetTails: function() {
        return this.tails;
    },
    GetTexFields: function() {
        return this.texFields;
    },
    Update: function() {
        for (var i = this.simpleFields.length - 1; i >= 0; i--) {
            if(this.simpleFields[i].active) {
                this.simpleFields[i].Callback();
            }
        }
        for (var i = this.tails.length - 1; i >= 0; i--) {
            if (this.tails[i].active) {
                this.tails[i].Callback();
            }
        }
    }
};