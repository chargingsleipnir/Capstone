/**
 * Created by Devin on 2015-02-21.
 */

function UFO() {

    var hoverHeight = 8.0;

    this.obj = new GameObject('ufo', Labels.none);
    this.obj.trfmLocal.SetBaseTransByAxes(-2.0, hoverHeight, -2.0);

    var coreObj = new GameObject("ufo core", Labels.none);
    coreObj.SetModel(GameMngr.assets.models['ufoCore']);

    var saucerObj = new GameObject("ufo saucer", Labels.none);
    saucerObj.SetModel(GameMngr.assets.models['ufoSaucer']);

    var ptclObj = new GameObject("ufo tractor beam particle effect", Labels.none);
    ptclObj.trfmLocal.SetBaseTransByAxes(0.0, -hoverHeight - 1.0, 0);

    // Not a bad idea, but will not work until I can better control blending issues
    //var beamObj = new GameObject("ufo tractor beam", Labels.none);
    //beamObj.SetModel(GameMngr.assets.models['ufoBeam']);
    //var halfBeamHeight = beamObj.shapeData.radii.y * beamObj.trfmLocal.scale.y;
    //beamObj.trfmLocal.SetBaseTransByAxes(0.0, -halfBeamHeight, 0);

    this.obj.AddChild(coreObj);
    this.obj.AddChild(saucerObj);
    this.obj.AddChild(ptclObj);
    //this.obj.AddChild(beamObj);

    // Add particle effects -------------------------------------------------
    ptclObj.AddComponent(Components.particleSystem);

    var effects = new PtclPhysicsEffects();
    effects.travelTime = 2.5;
    effects.startDist = 1.25;
    effects.dir.SetValues(0.0, 1.0, 0.0);
    effects.range = 90.0;
    effects.conicalDispersion = false;
    effects.speed = 3.0;
    effects.acc.SetValues(0.0, 0.0, 0.0);
    effects.dampening = 1.0;
    effects.colourBtm.SetValues(0.0, 1.0, 0.0);
    effects.colourTop.SetValues(1.0, 1.0, 0.0);
    effects.lineLength = 0.25;
    effects.alphaStart = 0.5;
    effects.fadePoint = 0.5;
    effects.alphaEnd = 0.5;
    effects.size = 0.0;
    var tractorBeamVisual = new ParticleField(100.0, true, null, effects);
    ptclObj.ptclSys.AddField(tractorBeamVisual);
    tractorBeamVisual.Run();

    var angle = 0.0;
    this.Update = function() {
        angle++;
        if(angle > 360.0)
            angle = 0.0;

        coreObj.trfmLocal.SetUpdatedOrient(VEC3_UP, angle);
        saucerObj.trfmLocal.SetUpdatedOrient(VEC3_UP, -angle);
    }
}