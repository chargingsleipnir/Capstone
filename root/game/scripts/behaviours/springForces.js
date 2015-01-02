/**
 * Created by Devin on 2014-12-30.
 */

function SpringLoad(scene, gameObjRB, anchorRB) {

    gameObjRB.SetMass(2.0);
    gameObjRB.dampening = 0.95;
    scene.forceRegistry.Add(gameObjRB, new ForceGenerators.Gravity(VEC3_GRAVITY));
    scene.forceRegistry.Add(gameObjRB, new ForceGenerators.Spring(anchorRB, 3.0, 4.0));
}

function SpringLoadPush(scene, gameObjRB, anchorRB) {

    gameObjRB.SetMass(2.0);
    gameObjRB.dampening = 0.95;

    scene.forceRegistry.Add(gameObjRB, new ForceGenerators.Spring_PushOnly(anchorRB, 2.0, 5.0));
}

function SpringLoadPull(scene, gameObjRB, anchorRB) {

    gameObjRB.SetMass(2.0);
    gameObjRB.dampening = 0.95;

    scene.forceRegistry.Add(gameObjRB, new ForceGenerators.Spring_PullOnly(anchorRB, 1.0, 10.0));
}