/**
 * Created by Devin on 2015-01-03.
 */

/******************************** Point and line Particles *****************************************/

function ParticleSimple(travelTime, countDown, startPos, startVel, acc, dampening, colour, alphaStart, fadePoint, alphaEnd) {
    // Physics
    this.startPos = startPos;
    this.startVel = startVel;
    this.acc = acc;
    this.dampening = dampening;
    this.pos = new Vector3(0.0, 999.0, 0.0);
    this.vel = new Vector3();
    // Duration
    this.travelTime = travelTime;
    this.countDown = countDown;
    this.isAlive = false;
    // Effects
    this.colour = new Vector4(colour.x, colour.y, colour.z, alphaStart);
    this.alphaStart = alphaStart;
    this.alphaDiff = alphaStart - alphaEnd;
    this.fadeCountStart = travelTime - (travelTime * fadePoint);
    this.fadeCounter = this.fadeCountStart;
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

            if(this.countDown < this.fadeCountStart) {
                this.fadeCounter -= Time.deltaMilli;
                var fadePct = 1.0 - (this.fadeCounter / this.fadeCountStart);
                this.colour.w = this.alphaStart - (fadePct * this.alphaDiff);
            }

            if(this.countDown < 0.0)
                this.Reset();
        }
    },
    Reset: function() {
        this.pos.SetCopy(this.startPos);
        this.vel.SetCopy(this.startVel);
        this.tailPos.SetCopy(this.startPos);
        this.countDown = this.travelTime;

        this.colour.w = this.alphaStart;
        this.fadeCounter = this.fadeCountStart;
    }
};

function ParticleFieldSimple(trfmObj, ptclCount, fieldLife, effects) {
    this.trfmObj = trfmObj;
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

    this.needsSorting = effects.texture ? true : false;

    // Instantiate particles
    var dir = effects.dir.GetNormalized();
    for(var i = 0; i < this.ptclCount; i++) {
        var randomX = Math.random(),
            randomY = Math.random(),
            randomZ = Math.random();

        var randConeAngle = (effects.range / 2.0) * (randomX * 2) - 1;
        var randRotAngle = 360 * randomY;
        var randDir = dir.GetRotated(randConeAngle, dir.GetOrthoAxis());
        randDir.SetRotated(randRotAngle, dir);

        this.ptcls.push(new ParticleSimple(
            effects.travelTime,
            effects.staggerRate * i,
            randDir.GetScaleByNum(effects.startDist),
            randDir.GetScaleByNum(effects.speed),
            effects.acc,
            effects.dampening,
            new Vector3(
                (effects.colourTop.x - effects.colourBtm.x) * randomX + effects.colourBtm.x,
                (effects.colourTop.y - effects.colourBtm.y) * randomY + effects.colourBtm.y,
                (effects.colourTop.z - effects.colourBtm.z) * randomZ + effects.colourBtm.z
            ),
            effects.alphaStart,
            effects.fadePoint,
            effects.alphaEnd
        ));

        // Once positions are established, sort from back to front
        // This stays here uniquely because it's using StartPos, not regular pos;
        if(this.needsSorting)
            this.SortForLaunch(i);
    }

    for(var i = 0; i < this.ptcls.length; i++) {
        ptclVerts.posCoords = ptclVerts.posCoords.concat(this.ptcls[i].pos.GetData());
        ptclVerts.colElems = ptclVerts.colElems.concat(this.ptcls[i].colour.GetData());

        if(effects.lineLength > 0) {
            this.ptcls[i].tailLength = effects.lineLength;
            ptclVerts.posCoords = ptclVerts.posCoords.concat(this.ptcls[i].tailPos.GetData());
            ptclVerts.colElems = ptclVerts.colElems.concat(this.ptcls[i].colour.GetData());
        }
    }

    if(effects.lineLength <= 0) {
        this.fieldHdlr = new PtclFieldHandler(ptclVerts, DrawMethods.points);
        if(effects.texture != null)
            this.fieldHdlr.SetTexture(effects.texture, TextureFilters.linear);

        this.fieldHdlr.pntSize = effects.size;
    }
    else
        this.fieldHdlr = new PtclFieldHandler(ptclVerts, DrawMethods.lines);
}
ParticleFieldSimple.prototype = {
    SortForLaunch: function(idx) {
        if(idx > 0) {
            do {
                var distThisPtcl = this.ptcls[idx].startPos.GetAdd(this.trfmObj.pos).SetSubtract(ViewMngr.activeCam.posGbl).GetMagSqr();
                var distPrevPtcl = this.ptcls[idx - 1].startPos.GetAdd(this.trfmObj.pos).SetSubtract(ViewMngr.activeCam.posGbl).GetMagSqr();

                if (distThisPtcl > distPrevPtcl) {
                    RefUtils.Swap(this.ptcls, idx, idx - 1);
                    idx--;
                }
                else
                    idx = 0;
            }
            while (idx > 0);
        }
    },
    SortPtcl: function(idx) {
        if(idx > 0) {
            do {
                var distThisPtcl = this.ptcls[idx].pos.GetAdd(this.trfmObj.pos).SetSubtract(ViewMngr.activeCam.posGbl).GetMagSqr();
                var distPrevPtcl = this.ptcls[idx - 1].pos.GetAdd(this.trfmObj.pos).SetSubtract(ViewMngr.activeCam.posGbl).GetMagSqr();

                if (distThisPtcl > distPrevPtcl) {
                    RefUtils.Swap(this.ptcls, idx, idx - 1);
                    idx--;
                }
                else
                    idx = 0;
            }
            while (idx > 0);
        }
    },
    BuildPtclObj: function() {
        var newPosCoords = [];
        var newColElems = [];
        for (var i = 0; i < this.ptcls.length; i++) {
            newPosCoords = newPosCoords.concat(this.ptcls[i].pos.GetData());
            newColElems = newColElems.concat(this.ptcls[i].colour.GetData());
            if(this.ptcls[i].tailLength > 0) {
                newPosCoords = newPosCoords.concat(this.ptcls[i].tailPos.GetData());
                newColElems = newColElems.concat(this.ptcls[i].colour.GetData());
            }
        }
        this.fieldHdlr.RewriteVerts(newPosCoords.concat(newColElems));
    },
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
        if(this.deadPtcls > 0) {
            for (var i = 0; i < this.ptcls.length; i++) {
                // This will stagger them out accordingly,
                // as pre-set in constructor
                if (this.ptcls[i].isAlive == false) {
                    this.ptcls[i].countDown -= Time.deltaMilli;
                    if (this.ptcls[i].countDown <= 0) {
                        this.ptcls[i].isAlive = true;
                        this.deadPtcls--;
                        this.ptcls[i].Reset();
                    }
                }
                else {
                    this.ptcls[i].Update();
                }
                if(this.needsSorting)
                    this.SortPtcl(i);
            }
            // Needs to happen after sorting, to draw properly
            this.BuildPtclObj();
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
        for (var i = 0; i < this.ptcls.length; i++) {
            this.ptcls[i].Update();
            if(this.needsSorting)
                this.SortPtcl(i);
        }
        // Needs to happen after sorting, to draw properly
        this.BuildPtclObj();
        this.CheckEnd();
    },
    Terminate: function() {
        /* This loop function is implemented to allow each particle field to slowly stagger
         * in, update, and stagger out all of it's particles, so they don't all have to arrive
         * or disappear at the same time. */
        if(this.deadPtcls < this.ptcls.length) {
            for (var i = 0; i < this.ptcls.length; i++) {
                if (this.ptcls[i].isAlive) {
                    this.ptcls[i].Update();
                    // This condition is met on during each particle's reset.
                    if (this.ptcls[i].countDown >= this.ptcls[i].travelTime - Time.deltaMilli) {
                        this.ptcls[i].isAlive = false;
                        this.ptcls[i].pos.SetValues(0.0, 999.0, 0.0);
                        this.ptcls[i].tailPos.SetValues(0.0, 999.0, 0.0);
                        this.deadPtcls++;
                    }
                    if(this.needsSorting)
                        this.SortPtcl(i);
                }
            }
            this.BuildPtclObj();
        }
        else {
            // Reset things
            this.Callback = this.Launch;
            this.counter = this.fieldLifeTime;
            for (var i = 0; i < this.ptcls.length; i++) {
                this.ptcls[i].countDown = this.stagger * i;

                // Resort based on start pos to make sure next iteration starts off smooth
                if(this.needsSorting)
                    this.SortForLaunch(i);
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

    // Work out alpha effects
    var alphas = [];
    var startFade = this.ptclCount * effects.fadePoint;
    startFade = Math.round(startFade);
    var remainder = this.ptclCount - startFade;
    var alphaIncr = (effects.alphaStart - effects.alphaEnd) / remainder;
    var incrCounter = 0;
    for(var i = 0; i < this.ptclCount; i++) {
        if(i < startFade)
            alphas.push(effects.alphaStart);
        else {
            incrCounter++;
            alphas.push(effects.alphaStart - (alphaIncr * incrCounter));
        }
    }

    this.posCoords = [];
    var colElems = [];
    for(var i = 0; i < this.ptclCount; i++) {
        this.posCoords.push(this.trfm.pos.x + this.axis.x);
        this.posCoords.push(this.trfm.pos.y + this.axis.y);
        this.posCoords.push(this.trfm.pos.z + this.axis.z);
        this.axis.SetNegative();

        colElems = colElems.concat(effects.colour.GetData());
        colElems.push(alphas[i]);
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
}
ParticleSystem.prototype = {
    AddSimpleField: function(ptclCount, fieldLife, effects) {
        this.simpleFields.push(new ParticleFieldSimple(this.trfmObj, ptclCount, fieldLife, effects));
    },
    AddTail: function(ptclCount, fieldLife, effects) {
        this.tails.push(new FlatTail(this.trfmObj, ptclCount, fieldLife, effects));
    },
    RemoveField: function(field) {
        var index = this.simpleFields.indexOf(field);
        if(index != -1) {
            this.simpleFields.splice(index, 1);
        }
    },
    RunField: function(index) {
        if(this.simpleFields[index])
            this.simpleFields[index].active = true;
    },
    RunTail: function(index) {
        if(this.tails[index])
            this.tails[index].active = true;
    },
    GetSimpleFields: function() {
        return this.simpleFields;
    },
    GetTails: function() {
        return this.tails;
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