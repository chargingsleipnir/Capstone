/**
 * Created by Devin on 2015-02-21.
 */

function UFO() {

    var that = this;

    var hoverHeight = 8.0;
    var TractorBeamingCallback = function(){};

    this.obj = new GameObject('ufo', Labels.none);
    this.obj.trfmBase.SetPosByAxes(-2.0, hoverHeight, 20.0);

    var coreObj = new GameObject("ufo core", Labels.none);
    coreObj.SetModel(GameMngr.assets.models['ufoCore']);

    var saucerObj = new GameObject("ufo saucer", Labels.none);
    saucerObj.SetModel(GameMngr.assets.models['ufoSaucer']);

    var ptclObjTractorLift = new GameObject("ufo tractor beam particle effect", Labels.none);
    ptclObjTractorLift.trfmBase.SetPosByAxes(0.0, -hoverHeight - 1.0, 0);

    //var ptclObjTractorRot = new GameObject("tail particle rotation", Labels.none);
    //ptclObjTractorRot.trfmOffset.SetPosByAxes(1.25, -hoverHeight / 2, 0.0);

    // Not a bad idea, but will not work until I can better control blending issues
    //var beamObj = new GameObject("ufo tractor beam", Labels.none);
    //beamObj.SetModel(GameMngr.assets.models['ufoBeam']);
    //var halfBeamHeight = beamObj.shapeData.radii.y * beamObj.trfmLocal.scale.y;
    //beamObj.trfmLocal.SetBaseTransByAxes(0.0, -halfBeamHeight, 0);

    this.obj.AddChild(coreObj);
    this.obj.AddChild(saucerObj);
    this.obj.AddChild(ptclObjTractorLift);
    //this.obj.AddChild(ptclObjTractorRot);

    // Add particle effects -------------------------------------------------
    ptclObjTractorLift.AddComponent(Components.particleSystem);
    var effects = new PtclPhysicsEffects();
    effects.travelTime = 2.5;
    effects.startDist = 1.25;
    effects.dir.SetValues(0.0, 1.0, 0.0);
    effects.range = 90.0;
    effects.conicalDispersion = false;
    effects.speed = 3.0;
    effects.acc.SetValues(0.0, 0.0, 0.0);
    effects.dampening = 1.0;
    effects.colourBtm.SetValues(0.25, 0.25, 0.25);
    effects.colourTop.SetValues(1.0, 0.75, 0.75);
    effects.lineLength = 0.25;
    effects.alphaStart = 0.5;
    effects.fadePoint = 0.5;
    effects.alphaEnd = 0.5;
    effects.size = 0.0;
    var tractorBeamVisual = new ParticleFieldAutomated(100.0, true, null, effects);
    ptclObjTractorLift.ptclSys.AddAutoField(tractorBeamVisual);

    var spiralEffects = new PtclSpiralEffects();
    spiralEffects.travelTime = 5.5;
    spiralEffects.startDist = 0.0;
    spiralEffects.dir = new Vector3(0.0, 1.0, 0.0);
    spiralEffects.range = 15.0;
    spiralEffects.scaleAngle = 5.0;
    spiralEffects.scaleDiam = 1.25;
    spiralEffects.scaleLen = 1.5;
    spiralEffects.colourBtm = new Vector3(0.25, 0.25, 0.25);
    spiralEffects.colourTop = new Vector3(1.0, 0.75, 0.75);
    spiralEffects.lineLength = 0.0;
    spiralEffects.size = 40.0;
    spiralEffects.texture = GameMngr.assets.textures['starPtcl'];
    spiralEffects.alphaStart = 0.75;
    spiralEffects.fadePoint = 1.0;
    spiralEffects.alphaEnd = 0.75;
    // rising star effect
    var starVisual = new ParticleFieldAutomated(40, true, null, spiralEffects);
    ptclObjTractorLift.ptclSys.AddAutoField(starVisual);

    /*
    ptclObjTractorRot.AddComponent(Components.particleSystem);
    var tailEffects = new FlatTailEffects();
    tailEffects.colour = new Vector3(0.5, 0.9, 0.1);
    tailEffects.thickness = hoverHeight;
    tailEffects.axis = Axes.y;
    tailEffects.alphaStart = 0.25;
    tailEffects.fadePoint = 0.5;
    tailEffects.alphaEnd = 0.0;
    var tractorWall = new FlatTail(10, null, tailEffects);
    ptclObjTractorRot.ptclSys.AddTail(tractorWall);
    */

    // Collisions -------------------------------------------------
    coreObj.AddComponent(Components.collisionSystem);
    coreObj.collider.rigidBody.SetMass(2000.0);
    var coreCapsuleCollider = new CollisionCapsule(coreObj);
    coreObj.collider.AddCollisionShape(BoundingShapes.capsule, coreCapsuleCollider);

    saucerObj.AddComponent(Components.collisionSystem);
    saucerObj.collider.rigidBody.SetMass(2000.0);
    var saucerDonutCollider = new CollisionDonut(saucerObj);
    saucerObj.collider.AddCollisionShape(BoundingShapes.donut, saucerDonutCollider);

    // Collision callbacks
    var coefOfRest = 0.1;
    function CoreCollision(collider) {
        var collisionDist = coreObj.trfmGlobal.pos.GetSubtract(collider.trfm.pos);
        var netVel = coreObj.collider.rigidBody.GetNetVelocity(collider.rigidBody);
        if (netVel.GetDot(collisionDist) < 0) {
            if (collider.gameObj.label == Labels.ammo) {
                collisionDist = coreCapsuleCollider.IntersectsCapsule(collider.suppShapeList[0].obj);
                if (collisionDist && netVel.GetDot(collisionDist) < 0) {
                    coreObj.collider.rigidBody.CalculateImpulse(collider.rigidBody, collisionDist, coefOfRest);
                    BecomeStunned();
                }
            }
        }
    }
    coreObj.collider.SetSphereCall(CoreCollision);
    function SaucerCollision(collider) {
        var collisionDist = saucerObj.trfmGlobal.pos.GetSubtract(collider.trfm.pos);
        var netVel = saucerObj.collider.rigidBody.GetNetVelocity(collider.rigidBody);
        if (netVel.GetDot(collisionDist) < 0) {
            if (collider.gameObj.label == Labels.ammo) {
                collisionDist = saucerDonutCollider.IntersectsCapsule(collider.suppShapeList[0].obj);
                if (collisionDist && netVel.GetDot(collisionDist) < 0) {
                    saucerObj.collider.rigidBody.CalculateImpulse(collider.rigidBody, collisionDist, coefOfRest);
                    BecomeStunned();
                }
            }
        }
    }
    saucerObj.collider.SetSphereCall(SaucerCollision);

    // AI -------------------------------------------------

    var TRACTOR_RANGE = 0.5;
    var TRACTOR_PULL_SPEED = 0.020;
    var ufoStates = {dormant: 0, abducting: 1, stunned: 2};
    var currState = ufoStates.dormant;
    var moveSpeed = 0.05;

    var stunCounter = 0.0;
    var STUN_TIME_MAX = 5.0;

    function SeekAcrossXZ(dir, speed) {
        var velocity = dir.GetScaleByNum(speed);
        // 2D movement for object in 3D world;
        that.obj.trfmBase.TranslateByAxes(velocity.x, 0.0, velocity.y);
    }
    function Tractor(abductee) {
        // Without physics
        abductee.SetGravBlock(true);
        abductee.obj.trfmBase.TranslateUp(TRACTOR_PULL_SPEED);
    }
    function BecomeStunned() {
        stunCounter = STUN_TIME_MAX;
        currState = ufoStates.stunned;
    }

    // UFO METHODS -------------------------------------------------

    this.SetTractorBeamingCallback = function(Callback) {
        TractorBeamingCallback = Callback;
    };
    this.Abduct = function(abductee, distSqr2D, dirVec) {
        //tractorWall.Stop();
        tractorBeamVisual.Stop();
        starVisual.Stop();
        switch(currState) {
            case ufoStates.abducting:
                // Don't stop travelling the second it starts tractoring. Keep trying to be right on top of it.
                if(distSqr2D > VERY_SMALL)
                    SeekAcrossXZ(dirVec.SetScaleByNum(1.0 / Math.sqrt(distSqr2D)), moveSpeed);
                // Start tractoring from a larger radius though
                if(distSqr2D < TRACTOR_RANGE) {
                    //tractorWall.Run();
                    tractorBeamVisual.Run();
                    starVisual.Run();
                    TractorBeamingCallback();
                    var dY = this.obj.trfmGlobal.pos.y - abductee.obj.trfmGlobal.pos.y;
                    if(dY > VERY_SMALL)
                        Tractor(abductee);
                    else {
                        tractorBeamVisual.Stop();
                        starVisual.Stop();
                        return true;
                    }
                }
                break;
            case ufoStates.stunned:
                stunCounter -= Time.deltaMilli;
                if(stunCounter <= 0.0)
                    currState = ufoStates.abducting;
                break;
            case ufoStates.dormant:
                break;
            default:
                currState = ufoStates.dormant;
                break;
        }
        return false;
    };

    this.SetActive = function(isActive) {
        if(isActive)
            currState = ufoStates.abducting;
        else
            currState = ufoStates.dormant;
    };

    // Update -------------------------------------------------
    var angle = 0.0;
    this.Update = function() {
        angle++;
        if(angle > 360.0)
            angle = 0.0;

        coreObj.trfmBase.SetUpdatedRot(VEC3_UP, angle * 2);
        saucerObj.trfmBase.SetUpdatedRot(VEC3_UP, -angle);
        //ptclObjTractorRot.trfmOffset.SetUpdatedRot(VEC3_UP, angle * 4);
    }
}