/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl03(scene, player, barn, cows, haybales, hud) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['lvl03Fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    GameUtils.RaiseToGroundLevel(fence);

    var UpdateHUDAbductionCount = function() {
        hud.guiTextObjs["rescueInfo"].UpdateMsg("" + GameUtils.GetCowsSaved());
        hud.guiTextObjs["abductionInfo"].UpdateMsg("" + GameUtils.GetCowsAbducted());
    };


    // Level Repeat functions ==========================================================================================

    function Start() {
        barn.obj.trfmBase.SetPosByAxes(10.0, 0.0, -10.0);
        barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 30);
        GameUtils.RaiseToGroundLevel(barn.obj);
        GameUtils.SetLevelBounds(fence);
    }

    function Update() {
        GameUtils.ContainInLevelBoundsUpdate(player.obj);
    }

    function End() {

    }

    scene.SetCallbacks(Start, Update, End);
}