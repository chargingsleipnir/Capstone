/**
 * Created by Devin on 2015-03-27.
 */

var GameUtils = (function() {

    var leftWall,
        rightWall,
        backWall,
        frontWall;

    var cowsEncountered = 0,
        cowsSavedByLevel = 0,
        cowsSavedTotal = 0,
        cowsAbductedByLevel = 0,
        cowsAbductedTotal = 0;

    return {
        RaiseToGroundLevel: function (gameObj) {
            gameObj.trfmBase.TranslateByAxes(0.0, gameObj.shapeData.radii.y * gameObj.trfmBase.scale.y, 0.0);
        },
        SetLevelBounds: function(gameObj) {
            leftWall = gameObj.shapeData.min.x;
            rightWall = gameObj.shapeData.max.x;
            backWall = gameObj.shapeData.max.z;
            frontWall = gameObj.shapeData.min.z;
        },
        ContainInLevelBoundsUpdate: function(gameObj) {
        if((gameObj.trfmGlobal.pos.x < leftWall + gameObj.shapeData.radii.x && gameObj.rigidBody.velF.x < 0) ||
            (gameObj.trfmGlobal.pos.x > rightWall - gameObj.shapeData.radii.x && gameObj.rigidBody.velF.x > 0))
            gameObj.rigidBody.velF.x = -gameObj.rigidBody.velF.x;

        if((gameObj.trfmGlobal.pos.z < frontWall + gameObj.shapeData.radii.z && gameObj.rigidBody.velF.z < 0) ||
            (gameObj.trfmGlobal.pos.z > backWall - gameObj.shapeData.radii.z && gameObj.rigidBody.velF.z > 0))
            gameObj.rigidBody.velF.z = -gameObj.rigidBody.velF.z;
        },
        GetCowsEncountered: function() {
            return cowsEncountered;
        },
        CowsEncounteredAdd: function(numCows) {
            cowsEncountered += numCows;
        },
        GetCowsSaved: function() {
            return cowsSavedByLevel;
        },
        GetCowsSavedTotal: function() {
            return cowsSavedTotal;
        },
        CowsSavedIncr: function() {
            cowsSavedByLevel++;
            cowsSavedTotal++;
        },
        CowsSavedZero: function() {
            cowsSavedByLevel = 0;
        },
        GetCowsAbducted: function() {
            return cowsAbductedByLevel;
        },
        GetCowsAbductedTotal: function() {
            return cowsAbductedTotal;
        },
        CowsAbductedIncr: function() {
            cowsAbductedByLevel++;
            cowsAbductedTotal++;
        },
        CowsAbductedAdd: function(numCows) {
            cowsAbductedByLevel += numCows;
            cowsAbductedTotal += numCows;
        },
        CowsAbductedZero: function() {
            cowsAbductedByLevel = 0;
        },
        ammoTypes: {
            cow: 0,
            hayBale: 1
        },
        Reset: function() {
            cowsEncountered =
            cowsSavedByLevel =
            cowsSavedTotal =
            cowsAbductedByLevel =
            cowsAbductedTotal = 0;
        },
        CheckWin: function() {
            return cowsSavedTotal >= Math.ceil(cowsEncountered / 2);
        }
    };
})();