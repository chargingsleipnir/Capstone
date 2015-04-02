/**
 * Created by Devin on 2015-04-01.
 */

function Probe(posArray, speed) {

    var that = this;

    // Use simple motion mechanics to move around the level.
    var dir = new Vector3();
    var wpIdx = 0;
    var hp = 2;

    this.obj = new GameObject('probe', Labels.none);
    var pos = this.obj.trfmGlobal.pos;
    this.obj.SetModel(GameMngr.assets.models['probe']);

    var playerObj,
        activeCows,
        activeHaybales;

    // This is some of the worst code I have...
    this.obj.AddComponent(Components.collisionSystem);
    function ProbeCollCallback(collider) {
        if (collider.gameObj == playerObj) {
            if(collider.suppShapeList[0].obj.IntersectsSphere(that.obj.collider.collSphere))
                SceneMngr.SetActive("End Screen Lose");
        }
        else if (collider.gameObj.name == "cow") {
            for (var i = 0; i < activeCows.length; i++)
                if (activeCows[i].obj == collider.gameObj) {
                    activeCows[i].SetVisible(false);
                    activeCows.splice(activeCows.indexOf(activeCows[i]), 1);
                    GameUtils.CowsAbductedIncr();
                }
            that.GetHit();
        }
        else if (collider.gameObj.name == "hay bale") {
            for (var i = 0; i < activeHaybales.length; i++)
                if (activeHaybales[i].obj == collider.gameObj) {
                    activeHaybales[i].SetVisible(false);
                    activeHaybales.splice(activeHaybales.indexOf(activeHaybales[i]), 1);
                }

            that.GetHit();
        }
    }
    this.obj.collider.SetSphereCall(ProbeCollCallback);

    this.SetCollidables = function($playerObj, $activeCows, $activeHaybales) {
        playerObj = $playerObj;
        activeCows = $activeCows;
        activeHaybales = $activeHaybales;
    };
    this.GetHit = function() {
        hp--;
        if(hp <= 0) {
            this.SetVisible(false);
        }
    };
    this.SetVisible = function(isVisible) {
        this.obj.mdlHdlr.active = isVisible;
        for (var i in this.obj.components)
            this.obj.components[i].SetActive(isVisible);
    };
    var angle = 0.0;
    this.Update = function() {
        angle+= 2.0;
        if(angle > 360.0)
            angle = 0.0;
        this.obj.trfmBase.SetUpdatedRot(VEC3_UP, angle);

        dir.SetValues(posArray[wpIdx][0] - pos.x, posArray[wpIdx][1] - pos.y, posArray[wpIdx][2] - pos.z);
        var magSqr = dir.GetMagSqr();
        if(magSqr < 1.0)
            wpIdx = (wpIdx + 1) % posArray.length;
        dir.SetScaleByNum(1.0 / Math.sqrt(magSqr));
        this.obj.trfmBase.TranslateByVec(dir.SetScaleByNum(speed * Time.deltaMilli));
    };
}