/**
 * Created by Devin on 2014-12-30.
 */

function SpringLoad(gameObj, anchorRB) {

    var particleBody = gameObj.rigidBody;
    particleBody.SetMass(2.0);
    particleBody.dampening = 0.95;
    ParticleForceRegistry.Add(particleBody, new ParticleForceGenerators.Spring(anchorRB, 3.0, 4.0));
}

function SpringLoadPush(gameObj, anchorRB) {

    var particleBody = gameObj.rigidBody;
    particleBody.SetMass(2.0);
    particleBody.dampening = 0.95;

    ParticleForceRegistry.Add(particleBody, new ParticleForceGenerators.Spring_PushOnly(anchorRB, 5.0, 10.0));
}

function SpringLoadPull(gameObj, anchorRB) {

    var particleBody = gameObj.rigidBody;
    particleBody.SetMass(2.0);
    particleBody.dampening = 0.95;

    ParticleForceRegistry.Add(particleBody, new ParticleForceGenerators.Gravity(VEC3_GRAVITY));
    ParticleForceRegistry.Add(particleBody, new ParticleForceGenerators.Spring_PullOnly(anchorRB, 1.0, 0.5));
}